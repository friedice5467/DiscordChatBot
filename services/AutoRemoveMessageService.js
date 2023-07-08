async function removeCommandMessage(message) {
  try {
    await message.delete();
  } catch (error) {
    console.error(`Failed to delete message: ${error.message}`);
  }
}

module.exports = removeCommandMessage;
