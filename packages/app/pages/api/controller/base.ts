import dbConnect from "../config/mongodb";
import SendResponse from "../helper/sendResponse";

// (async () => {
//   await dbConnect();
// })();

class BaseController extends SendResponse {
  constructor() {
    super();
  }
}

export default BaseController;
