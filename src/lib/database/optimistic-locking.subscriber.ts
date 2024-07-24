import {
  EntitySubscriberInterface as EntitySubscriber,
  EventSubscriber,
  OptimisticLockVersionMismatchError,
  UpdateEvent,
} from 'typeorm';

const EXPECTED_VERSION_METADATA = Symbol();

@EventSubscriber()
export class OptimisticLockingSubscriber implements EntitySubscriber {
  beforeUpdate(event: UpdateEvent<any>): void {
    if (!event.entity || !event.metadata.versionColumn) {
      return;
    }
    const currentVersion = Reflect.get(
      event.entity,
      event.metadata.versionColumn.propertyName,
    );
    const expectedVersionAfterUpdate = currentVersion + 1;
    Reflect.defineMetadata(
      EXPECTED_VERSION_METADATA,
      expectedVersionAfterUpdate,
      event.entity,
    );
  }

  afterUpdate(event: UpdateEvent<any>): void {
    if (!event.entity || !event.metadata.versionColumn) {
      return;
    }

    const expectedVersion = Reflect.getMetadata(
      EXPECTED_VERSION_METADATA,
      event.entity,
    );

    Reflect.deleteMetadata(EXPECTED_VERSION_METADATA, event.entity);

    const actualVersion = Reflect.get(
      event.entity,
      event.metadata.versionColumn.propertyName,
    );

    if (expectedVersion !== actualVersion) {
      throw new OptimisticLockVersionMismatchError(
        event.entity.constructor.name,
        expectedVersion,
        actualVersion,
      );
    }
  }
}
