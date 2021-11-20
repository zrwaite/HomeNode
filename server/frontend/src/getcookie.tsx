import Cookies from "universal-cookie";

function getcookie(cookie: string, disable_alternate: boolean) {
  const cookies = new Cookies();
  if (cookies.get(cookie)) {
    return cookies.get(cookie);
  } else if (!disable_alternate) {
    switch (cookie) {
      case "token":
        return "INVALID_COOKIE";
      case "user":
        return "GeorgeShao123@gmail.com";
      case "home_id":
        return "61870da5d98c502cf04c576c";
      case "user_id":
        return "6196ee9929168d65cb1d18cc";
      case "sensor_id":
        return "61870da5d98c502cf04c5770";
      case "intruders_id":
        return "6196f37d29168d65cb1d2adb";
      default:
        return "INVALID_COOKIE";
    }
  } else {
    return "INVALID_COOKIE";
  }
}

export default getcookie;
