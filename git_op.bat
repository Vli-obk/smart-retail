git status > git_out.txt 2>&1
git add . >> git_out.txt 2>&1
git commit -m "UI updates and client registration" >> git_out.txt 2>&1
git push origin feature/frontend >> git_out.txt 2>&1
