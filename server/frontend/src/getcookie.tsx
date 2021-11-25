import Cookies from "universal-cookie";

function getcookie(cookie: string, disable_alternate: boolean) {
  const cookies = new Cookies();
  if (cookies.get(cookie)) {
    return cookies.get(cookie);
  } else if (!disable_alternate) {
    switch (cookie) {
      case "token":
        return "Loading...";
      case "name":
        return "George"
      case "email":
        return "GeorgeShao246@gmail.com";
      case "home_id":
        return "61870da5d98c502cf04c576c";
      case "sensors_id":
        return "61870da5d98c502cf04c5770";
      case "intruders_id":
        return "6196f37d29168d65cb1d2adb";
      default:
        return "Loading...";
    }
  } else {
    return "Loading...";
  }
}

export default getcookie;
