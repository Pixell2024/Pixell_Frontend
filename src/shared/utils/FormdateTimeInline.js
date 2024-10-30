const formatDateTime = (date) => {
  const optionsTime = { hour: "2-digit", minute: "2-digit", hour12: true };
  const optionsDate = { month: "short", day: "2-digit", year: "numeric" };

  const time = new Intl.DateTimeFormat("en-US", optionsTime).format(date); // 02:01 PM
  const formattedDate = new Intl.DateTimeFormat("en-US", optionsDate).format(
    date
  ); // Oct 04, 2024

  return `${time},\n${formattedDate}`; // New line after time
};
