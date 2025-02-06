export default async function (api) {
  const mode = await api.makeList({
    message: '请选择代码模式',
    choices: [
      {
        name: 'API',
        value: 'api'
      },
      {
        name: '默认',
        value: 'default'
      }
    ]
  })
  return { mode }
}
