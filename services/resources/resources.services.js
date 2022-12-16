const FSPORT = process.env.RESOURCES_PORT || 3005;
const axios = require("axios");

// const relationTypes = ['ring', 'shill']
const imageTypes = ["button", "banner", "ad"];

class ResourcesService {
  constructor(link = `http://localhost:${FSPORT}/cloudinary`) {
    this.link = link;
  }

  async filesReq(route) {
    const filesReq = await axios.get(`${this.link}/${route}`);
    const filesArr = filesReq.data.data.files;
    return filesArr;
  }

  async getAllButtonsAndBannersAndOrderByTag(tags = imageTypes, filter = []) {
    try {
      const filesArr = await this.filesReq("buttons-banners-etc");
      const filteredByTag = filesArr.filter((f) => {
        return (
          f.tags.some((t) => tags.includes(t)) &&
          !f.tags.some((t) => filter.includes(t))
        );
      });
      return {
        success: true,
        data: filteredByTag,
      };
    } catch (e) {
      console.error(e);
      return {
        success: false,
        data: e.message,
      };
    }
  }

  async getAllGifs() {
    try {
      const filesArr = await this.filesReq("gifs-epicos");
      console.log(filesArr)
      return {
        success: true,
        data: filesArr,
      };
    } catch (e) {
      console.error(e);
      return {
        success: false,
        data: e.message,
      };
    }
  }
}


module.exports = ResourcesService