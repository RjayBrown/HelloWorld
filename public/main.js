// Page Theme
const pageTheme = document.querySelector('html')
const themeToggle = document.querySelector('.theme')
const header = document.querySelector('header')
const cards = document.querySelectorAll('.greeting')
const likeText = document.querySelectorAll('.like-text')
const likeBtn = document.querySelectorAll('.likeBtn')

// Get or set theme on page load
if (!localStorage.getItem('theme')) {
    pageTheme.className = 'dark'
    header.className = 'header-dark'
    themeToggle.src = 'sun.png'
    likeText.forEach(word => {
        word.classList.add('like-dark')
    })
    likeBtn.forEach(btn => {
        btn.classList.add('likeBtn-dark')
        btn.src = 'like.png'

        btn.addEventListener('mouseout', () => {
            btn.src = 'like.png'
        })
    })
} else {
    pageTheme.className = localStorage.getItem('theme')
    header.className = localStorage.getItem('header')
    themeToggle.src = localStorage.getItem('theme-img')
    likeText.forEach(word => {
        word.classList.add(localStorage.getItem('like-text'))
    })
    cards.forEach(card => {
        card.classList.add(localStorage.getItem('greeting-card'))
    })
    likeBtn.forEach(btn => {
        btn.classList.add(localStorage.getItem('btn'))
        btn.src = localStorage.getItem('btn-img')

        btn.addEventListener('mouseout', () => {
            btn.src = localStorage.getItem('btn-img')
        })
    })
}

// Toggle Theme
themeToggle.addEventListener('click', () => {
    if (pageTheme.className === 'dark') {
        pageTheme.className = 'light'
        header.classList.remove('header-dark')
        header.classList.add('header-light')
        themeToggle.src = 'moon.png'
        cards.forEach(card => {
            card.classList.remove('greeting-dark')
            card.classList.add('greeting-light')
        })
        likeText.forEach(word => {
            word.classList.remove('like-dark')
            word.classList.add('like-light')
        })
        likeBtn.forEach(btn => {
            btn.classList.remove('likeBtn-dark')
            btn.classList.add('likeBtn-light')
            btn.src = 'like2.png'
        })
        localStorage.setItem('theme', 'light')
        localStorage.setItem('header', 'header-light')
        localStorage.setItem('theme-img', 'moon.png')
        localStorage.setItem('greeting-card', 'greeting-light')
        localStorage.setItem('like-text', 'like-light')
        localStorage.setItem('btn', 'likeBtn-light')
        localStorage.setItem('btn-img', 'like2.png')
    } else if (pageTheme.className === 'light') {
        pageTheme.className = 'dark'
        header.classList.remove('header-light')
        header.classList.add('header-dark')
        themeToggle.src = 'sun.png'
        cards.forEach(card => {
            card.classList.remove('greeting-light')
            card.classList.add('greeting-dark')
        })
        likeText.forEach(word => {
            word.classList.remove('like-light')
            word.classList.add('like-dark')
        })
        likeBtn.forEach(btn => {
            btn.classList.remove('likeBtn-light')
            btn.classList.add('likeBtn-dark')
            btn.src = 'like.png'
        })
        localStorage.setItem('theme', 'dark')
        localStorage.setItem('header', 'header-dark')
        localStorage.setItem('theme-img', 'sun.png')
        localStorage.setItem('greeting-card', 'greeting-dark')
        localStorage.setItem('like-text', 'like-dark')
        localStorage.setItem('btn', 'likeBtn-dark')
        localStorage.setItem('btn-img', 'like.png')
    }
})

// Input fields
const addGreeting = document.querySelector('.addGreeting')
const changeGreeting = document.querySelector('.changeGreeting')
const newGreeting = document.querySelector('.newGreeting')

// Buttons
const updateBtn = document.querySelector('#updateBtn')
const delBtn = document.querySelectorAll('.delBtn')

// Greetings list
const greetings = document.querySelectorAll('.greetingText')
const greetingBtn = document.querySelectorAll('.greeting')


const msg = document.querySelector('.message')
const likeCount = document.querySelector('.likeCount')

// Send update request for greeting to server on click, reset likes counter if greeting is not similar
updateBtn.addEventListener('click', async () => {
    try {
        if (!changeGreeting.value) {
            msg.textContent = 'Choose greeting to update'
        } else if (!newGreeting.value) {
            msg.textContent = 'New greeting must not be empty'
        } else {
            if (!newGreeting.value.includes(changeGreeting.value)) {
                await fetch('/greetings', {
                    method: 'put',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        greeting: changeGreeting.value,
                        newGreeting: newGreeting.value,
                        newGreetingLikes: 0

                    })
                })
            } else {
                await fetch('/greetings', {
                    method: 'put',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        greeting: changeGreeting.value,
                        newGreeting: newGreeting.value,
                    })
                })
            }
            window.location.reload(true)
        }
    }
    catch {
        console.log('Fetch (update greetings) error!')
    }
})

// increase like count and update database
likeBtn.forEach(btn => {
    btn.addEventListener('click', async () => {
        try {
            await fetch('/likes', {
                method: 'put',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    greeting: btn.classList[1].split('-').join(' ')
                })
            })
            window.location.reload(true)
        }
        catch {
            console.log('Fetch (update likes) error!')
        }
    })
})

// Send delete request to server on button click
delBtn.forEach(btn => {
    btn.addEventListener('click', async () => {
        try {
            await fetch('/greetings', {
                method: 'delete',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    greeting: btn.classList[1].split('-').join(' ')
                })
            })
            window.location.reload(true)
        }
        catch {
            console.log('Fetch (delete greeting) error!')
        }
    })
})

// Handle empty list on page load, connect rendered greetings to input field for update/delete requests
if (!greetings) {
    msg.textContent = 'Add your first greeting here!'
} else {
    for (let greeting of greetings) {
        greeting.addEventListener('click', () => {
            changeGreeting.value = greeting.firstElementChild.textContent.trim()
            // console.log(greeting)
        })
    }
}
