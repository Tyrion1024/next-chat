// Example POST method implementation:
export async function post(url = "", data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });

  console.log(response)

  if (response.status === 200) {
    return {
      success: true,
      data: response.json(),
      message: ''
    }
  } else {
    return {
      success: false,
      message: response.statusText,
      data: null
    }
  }

}

const paramsToString = (url: string, params: any = {}) => {
  let pString = ''
  Object.keys(params).forEach((key: string, i) => {
    pString += `${i ? '&' : ''}${key}=${params[key]}`
  })
  return pString ? `${url}${url.includes('?') ? '&' : '?'}${pString}` : url
}

export async function get(url: string, params = {}, data = {}) {

  const response = await fetch(paramsToString(url, params), {
    method: "GET", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });


  if (response.status === 200) {
    return {
      success: true,
      data: response.json(),
      message: ''
    }
  } else {
    return {
      success: false,
      message: response.statusText,
      data: null
    }
  }
}