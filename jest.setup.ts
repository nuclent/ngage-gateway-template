global.rpcSpyOn = (service: any, task: string, response?: any) => {
  const preFn = jest.spyOn(service, `pre${task}`)
  const processFn = jest.spyOn(service, `process${task}`)
  const postFn = jest.spyOn(service, `post${task}`)
  // response && processFn.mockResolvedValueOnce(response)
  return { preFn, processFn, postFn }
}
