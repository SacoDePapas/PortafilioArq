export default function warning(condition, message, ...args) {
  if (condition) return;

  const formattedMessage = String(message).replace(/%s/g, () => String(args.shift()));
  console.error(`Warning: ${formattedMessage}`);
}
