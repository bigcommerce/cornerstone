export function findByBackorderMessageIdOrDefault(messages, id) {
    const assignedMessage = messages.find(m => m.id === id);
    const defaultMessage = messages.find(m => m.is_default);

    return assignedMessage ?? defaultMessage;
}
