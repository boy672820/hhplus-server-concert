export const getEncodedDates = () => {
  const before = new Date();
  const after = new Date();
  before.setDate(1);
  after.setMonth(after.getMonth() + 2);
  const startDate = before.toISOString().split('T')[0] + 'T00:00:00';
  const endDate = after.toISOString().split('T')[0] + 'T23:59:59';
  return {
    startDate: encodeURIComponent(startDate),
    endDate: encodeURIComponent(endDate),
  };
};
