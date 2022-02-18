import { TIMEOUT_SECONDS } from '../config/config';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, recipe = undefined) {
  try {
    const uploadData = JSON.stringify(recipe);
    const fetchPromise = recipe
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: uploadData,
        })
      : fetch(url);

    const res = await Promise.race([fetchPromise, timeout(TIMEOUT_SECONDS)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    return data;
    //
  } catch (error) {
    throw error;
  }
};

// export const getJSON = async function (url) {
//   try {
//     const fetchPromise = fetch(url);
//     const res = await Promise.race([fetchPromise, timeout(TIMEOUT_SECONDS)]);
//     const data = await res.json();

//     if (!res.ok) throw new Error(`${data.message} (${res.status})`);
//     return data;
//     //
//   } catch (error) {
//     throw error;
//   }
// };

// export const sendJSON = async function (url, recipe) {
//   try {
//     const uploadData = JSON.stringify(recipe);

//     const fetchPromise = fetch(url, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: uploadData,
//     });
//     const res = await Promise.race([fetchPromise, timeout(TIMEOUT_SECONDS)]);
//     const data = await res.json();

//     return data;
//     //
//   } catch (error) {
//     throw error;
//   }
// };
