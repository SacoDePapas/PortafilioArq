export default function invariant(condition, message, ...args) {
  if (condition) return;

  if (message === undefined) {
    throw new Error('invariant requires an error message argument');
  }

  const formattedMessage = String(message).replace(/%s/g, () => String(args.shift()));
  const error = new Error(formattedMessage);
  error.name = 'Invariant Violation';
  throw error;
}
