import http from 'axios'


export class SupportfileAPI {

  /**
   * 
   * @param branchId 
   * @returns 
   */
  public async convertToBase64 (url:string) : Promise<string > {
    try {

        console.log(" }}}}}  convert to Base 64   {{{")
        const image = await http.get(url, {responseType: 'arraybuffer'});
        const raw = Buffer.from(image.data).toString('base64');
        const base64Image = "data:" + image.headers["content-type"] + ";base64,"+raw; 
       console.log(base64Image)
        return base64Image;
    } catch (error: any) {
      console.log('error @ branchDetailsById', error.response.data.errors);
      throw new Error(error.response.data.errors[0]?.message);
    }
  }
}