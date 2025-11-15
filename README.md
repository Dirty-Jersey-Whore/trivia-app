# trivia-app
Trivia website and app
# Trivia App

A simple trivia game website with questions stored in JSON format. Designed to work on web and potentially as a mobile app later.

## Project Overview

- **Hosting**: DigitalOcean Droplet
- **Domain**: Managed through Cloudflare
- **Data Storage**: JSON files (version controlled via Git)
- **Backup**: GitHub repository

## Project Steps

### ✅ Step 1: GitHub Repository Setup
- [x] Create GitHub repository
- [x] Clone to local machine
- [x] Create basic folder structure
- [x] Initial commit

### 🔲 Step 2: Create Trivia Questions (JSON)
- [ ] Design JSON structure for questions
- [ ] Add first set of questions (State Capitals)
- [ ] Support multiple choice and short answer formats
- [ ] Organize by categories

### 🔲 Step 3: Build HTML/CSS/JS Frontend
- [ ] Create main game interface
- [ ] Display questions from JSON
- [ ] Handle user answers
- [ ] Score tracking
- [ ] Mobile responsive design

### 🔲 Step 4: Set Up DigitalOcean Droplet
- [ ] Create new Droplet (Ubuntu)
- [ ] Configure SSH access
- [ ] Install Nginx web server
- [ ] Set up basic security (firewall, etc.)

### 🔲 Step 5: Deploy to DigitalOcean
- [ ] Clone GitHub repo to Droplet
- [ ] Configure Nginx to serve files
- [ ] Set up automatic deployment (optional)

### 🔲 Step 6: Connect Domain via Cloudflare
- [ ] Point domain/subdomain to Droplet IP
- [ ] Configure DNS settings in Cloudflare
- [ ] Set up SSL certificate (Let's Encrypt)
- [ ] Enable Cloudflare proxy (optional)

### 🔲 Step 7: Future Enhancements
- [ ] Add more question categories
- [ ] User accounts and score tracking (requires database)
- [ ] Leaderboards
- [ ] Timer for questions
- [ ] Difficulty levels
- [ ] Convert to mobile app

## File Structure
```
trivia-app/
├── index.html          # Main game page
├── style.css           # Styling
├── script.js           # Game logic
├── data/
│   └── questions.json  # All trivia questions
└── README.md           # This file
```

## Data Format

Questions are stored in JSON format:
```json
{
  "categories": [
    {
      "name": "State Capitals",
      "questions": [...]
    }
  ]
}
```

## Backup Strategy

- Primary: Files on DigitalOcean Droplet
- Backup: GitHub repository (push after updates)
- Local: Development copy on local machine

## Notes

- Started with JSON instead of Google Sheets for data ownership
- Can migrate to PostgreSQL later if needed for user features
- Keeping it simple to start, add complexity as needed
