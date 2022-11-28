async function initializeMediaUpload(client, size) {
  const data = await client.post("media/upload", {
    command: "INIT",
    total_bytes: size,
    media_type: "image/gif",
  });
  return data.media_id_string;
}

async function appendFileChunk(client, mediaId, b64data) {
    const data = await client.post("media/upload", {
    command: "APPEND",
    media_id: mediaId,
    media_data: b64data,
    segment_index: 0,
  });
  return data.media_id_string;
}

async function finalizeUpload(client, mediaId) {
    try{
    const data = await client.post(
      "media/upload",
      {
        command: "FINALIZE",
        media_id: mediaId,
      },
    );
    return mediaId
    }catch(e){
        console.error(e)
    }
}

//   function publishStatusUpdate(mediaId) {
//     return new Promise(function(resolve, reject) {
//       client.post("statuses/update", {
//         status: "",
//         media_ids: mediaId
//       }, function(error, data, response) {
//         if (error) {
//           console.log(error)
//           reject(error)
//         } else {
//           console.log("Successfully uploaded media and tweeted!")
//           resolve(data)
//         }
//       })
//     })
//   }

module.exports = { initializeMediaUpload, appendFileChunk, finalizeUpload };
