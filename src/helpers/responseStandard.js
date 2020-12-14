module.exports = (response, message, initialData, status = 200, success = true) => {
  return response.send({
    message,
    initialData,
    status,
    success
  })
}
