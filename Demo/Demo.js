const apiKey = 'AIzaSyCx_Lq1FFjiUEwREHw-AvD129md7dw8z4E'; // Đây là API key của bạn
// Lấy các phần tử từ DOM
const videoIdInput = document.getElementById('videoId');
const fetchInfoButton = document.getElementById('fetchInfo');
const videoInfoContainer = document.getElementById('videoInfo');
const titleElement = document.getElementById('title');
const descriptionElement = document.getElementById('description');
const viewsElement = document.getElementById('views');

// Hàm lấy thông tin video từ YouTube API
async function getVideoInfo(videoId) {
    try {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${apiKey}`);
        const data = await response.json();
        
        if (data.items && data.items.length > 0) {
            const video = data.items[0];
            const title = video.snippet.title;
            const description = video.snippet.description;
            const views = video.statistics.viewCount;

            // Cập nhật thông tin video lên trang web
            titleElement.textContent = title;
            descriptionElement.textContent = description;
            viewsElement.textContent = views;
            videoInfoContainer.style.display = 'block';
        } else {
            alert('Không tìm thấy video. Hãy kiểm tra lại Video ID.');
            videoInfoContainer.style.display = 'none';
        }
    } catch (error) {
        console.error('Error fetching video info:', error);
        alert('Có lỗi xảy ra khi truy cập API.');
    }
}

// Thêm sự kiện khi người dùng nhấn vào nút "Get Video Info"
fetchInfoButton.addEventListener('click', () => {
    const videoId = videoIdInput.value.trim();
    if (videoId) {
        getVideoInfo(videoId);
    } else {
        alert('Vui lòng nhập Video ID.');
    }
});
