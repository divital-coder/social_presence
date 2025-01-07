github have removed the authentication support via https/http protocols
have to use ssh instead
generate an ssh key for ur device
[ssh-keygen -t rsa -b 4096 -C "divital2004@gmail.com" ]
now you have to add the key generated file ending with .pub extension to your github setting page, and authenticate.

voila you are now ready to start using github directly from your terminal. For achieving git usage from your terminal. clone the directory using git command instead of using https
[git clone git@github.com:divital-coder/repo_name.git]

then keep using your stuff like usual
git add . [for adding changes to the buffer]
git commit -m "text"
git push origin [branchname]


In case your contribution chart is not updating after recent commits, run :
git config --global user.name "divital-coder"
git config --global user.email divital2004@gmail.com

then:
git commit --amend --reset-author


Other git commands : 
git log
git status
git add .
git add path
git commit -m "Short desc"
git commit -am "Short desc"
git commit -a --amend
git push
git push -u origin divita-coder/branch-name
git switch branch-name
git switch -c divital-coder/branch-name
git branch -D divital-coder/branch-name
git pull --ff-only origin <current_branch>
git fetch origin main
git reset --hard origin/main
git checkout --.
git rebase origin/main
git rebase -i HEAD~<N>
git rebase --onto
git cherry-pick <hash>
git stash
git stash pop
git stash list
git remote add upstream <url>
git bisect 
git reflog
