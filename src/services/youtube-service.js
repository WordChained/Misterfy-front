import axios from 'axios';
import he from 'he'

const YT_API_KEY = 'AIzaSyCMj38_kYcY6ulLi9FWA5qlYkgUxWUnkoQ'
const SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search'
const DETAILS_URL = 'https://www.googleapis.com/youtube/v3/videos'
export const youtubeService = {
  query,
  getSongById,
  getDuration,
  getTitle
}

async function query(query) {
  try {
    const res = await axios.get(`${SEARCH_URL}?videoCategoryId=10&part=id,snippet&videoEmbeddable=true&type=video&maxResults=10&q=${query}&key=${YT_API_KEY}`)
    return res.data
  } catch (err) {
    console.log(err)
  }
}
async function getSongById(youtubeId) {
    try {
        const res = await axios.get(`${DETAILS_URL}?id=${youtubeId}&part=id,contentDetails,snippet&key=${YT_API_KEY}`);
        return res.data
    } catch (err) {
        console.log(err)
        throw err
    }
}

async function getDuration(youtubeId) {
  const res = await axios.get(`${DETAILS_URL}?id=${youtubeId}&part=contentDetails&key=${YT_API_KEY}`)
  let duration = res.data.items[0].contentDetails.duration
  try {
    duration = duration.substring(2)
    duration = duration.replace('M', ':')
    duration = duration.split(':')
    duration[1] = duration[1].replace('S', '')
    duration[1] = duration[1].padStart(2, '0')
    duration = duration.join(':')
    return duration.toString()
  } catch (err) {
    return null
  }
}

function getTitle(title) {
  // Removes HTML char codes
  let output = he.decode(title);
  // Removes 'Official Video' brackets
  const officialVideoRegex = /[([].?(official.?video)?(official music video)?.?[)\]]/ig
  output = output.replace(officialVideoRegex, '');
  return output;
}