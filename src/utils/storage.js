const salvarDados = (bucket, value) => {
  localStorage.setItem(bucket, JSON.stringify(value));
}

const recuperarDados = (bucket) => {
  return JSON.parse(localStorage.getItem(bucket))
}

export { salvarDados, recuperarDados }