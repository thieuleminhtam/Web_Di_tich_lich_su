function initHome() {  
contentDiv.innerHTML = storyContent;
const storyData = [
  "Story 1: Nội dung 1.",
  "Story 2: Nội dung 2.",
  "Story 3: Story thứ 3.",
  "Story 4: Story thứ 4.",
  "Story 5: Story thứ 5.",
  "Story 4: Story thứ 4.",
  "Story 4: Story thứ 4.",
  "Story 4: Story thứ 4.",
];

const container = document.getElementById('storyContainer');

// Tạo DOM story + số
storyData.forEach((text,i)=>{
  const div = document.createElement('div');
  div.className = 'story';
  div.setAttribute('data-index', i+1); // số thứ tự
  div.textContent = text;
  container.appendChild(div);
});

const stories = container.children;
let currentIndex = 0;

function updateStories(){
  const storyHeight = stories[0].getBoundingClientRect().height + 40; // gap
  const sidebarHeight = document.querySelector('.story-sidebar').clientHeight;

  // Story giữa luôn căn giữa sidebar
  let move =currentIndex * storyHeight - (sidebarHeight/2 - storyHeight/2);
  const maxMove = container.scrollHeight - sidebarHeight;
  if(move < 0) move = 0;
  if(move > maxMove) move = maxMove;

  container.style.transform = `translateY(${-move}px)`;

  // Cập nhật active
  for(let i=0;i<stories.length;i++){
    stories[i].classList.remove('active');
  }
  if(stories[currentIndex]) stories[currentIndex].classList.add('active');
}

// Khởi tạo
updateStories();

// Scroll từng story
function nextStory(){
  if(currentIndex < storyData.length-1){
    currentIndex++;
    updateStories();
  }
}
function prevStory(){
  if(currentIndex > 0){
    currentIndex--;
    updateStories();
  }
}

document.addEventListener('keydown', e=>{
  if(e.key==='ArrowDown') nextStory();
  if(e.key==='ArrowUp') prevStory();
});

document.querySelector('.story-sidebar').addEventListener('wheel', e=>{
  e.preventDefault();
  if(e.deltaY>0) nextStory();
  if(e.deltaY<0) prevStory();
});


}