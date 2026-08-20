#!/bin/bash
echo "Deploying to Hugging Face Spaces..."

# Check if there are uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo "Committing pending changes locally..."
    git add .
    git commit -m "chore: auto-commit before deploy"
fi

# 1. Create a clean orphan branch
git checkout --orphan hf-deploy-temp

# 2. Reset staging area
git reset

# 3. Add only the required files
git add app.py requirements.txt mlpipeline/ .gitignore

# 4. Create HF README inline (without overriding local README tracking)
cat << 'README_EOF' > README.md
---
title: Glimpse ML Pipeline
emoji: 📸
colorFrom: blue
colorTo: indigo
sdk: gradio
python_version: 3.11
app_file: app.py
pinned: false
---
# Glimpse ML Pipeline
FastAPI backend for face recognition and embedding extraction running on ZeroGPU.
README_EOF
git add README.md

# 5. Commit
git commit -m "deploy: Hugging Face release"

# 6. Push to HF Spaces
git push -f hf hf-deploy-temp:main

# 7. Restore local state
git checkout -f main
git branch -D hf-deploy-temp
git checkout -- README.md

echo "Deployment complete!"
