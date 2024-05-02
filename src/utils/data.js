// eslint-disable-next-line import/prefer-default-export
/* export const regrex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/; */ // не работает с https://www.ya

// eslint-disable-next-line import/prefer-default-export
export const regrex = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/[^\s]*)?$/;
