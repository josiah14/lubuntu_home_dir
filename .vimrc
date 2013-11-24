execute pathogen#infect()

autocmd Syntax c,cpp,vim,less,haml,ruby,css,html,xml,html,xhtml,perl normal zR

set mouse+=a
if &term =~ '^screen'
    " tmux knows the extended mouse mode
    set ttymouse=xterm2
endif

set nocompatible

" first, enable status line always
set laststatus=2

" set the command bar height
set cmdheight=1

" don't redraw while executing macros
set lazyredraw

" set autoread when file is externally edited
set autoread

" set how many lines of history vim should remember
set history=1000

" turn backup off since stuff is backed up in github
set nobackup
set nowb
set noswapfile

" close all the buffers
map <leader>cb :1,1000 bd!<cr>

function! InsertStatuslineColor(mode)
  if a:mode == 'i'
    hi statusline ctermbg=53 ctermfg=11
  elseif a:mode == 'r'
    hi statusline ctermbg=22 ctermfg=203
  else
    hi statusline ctermbg=52 ctermfg=10
  endif
endfunction

au InsertEnter * call InsertStatuslineColor(v:insertmode)
au InsertChange * call InsertStatuslineColor(v:insertmode)
au InsertLeave * hi statusline ctermbg=232 ctermfg=7

if has("gui")
    colorscheme jgb256
    set guifont=Monaco:h13
else
    colorscheme jgb256
endif

set hlsearch

syntax on
filetype plugin indent on
" show and get rid of trailing whitespace
match ErrorMsg '\s\+$'
function ShowSpaces(...)
    let @/='\v(\s+$)|( +\ze\t )'
    let oldhlsearch=&hlsearch
    if !a:0
      let &hlsearch=!&hlsearch
    else
      let &hlsearch=a:1
    end
    return oldhlsearch
endfunction

function TrimSpaces() range
  let oldhlsearch=ShowSpaces(1)
  execute a:firstline.",".a:lastline."substitute ///gec"
  let &hlsearch=oldhlsearch
endfunction

nmap <silent> <F5> :call TrimSpaces()<CR>


let g:gist_clip_command = 'pbcopy'

"autocmd FileType html,xml,haml,less,css,ruby match OverLength '\%>80v.\+'
"autocmd FileType html,xml,haml,less,css,ruby highlight OverLength ctermbg=darkred ctermfg=white guibg=#59

if exists('+colorcolumn')
    highlight ColorColumn ctermbg=233 guibg=black
    let &colorcolumn="81,".join(range(121,999),",")
else
    au BufWinEnter * let w:m2=matchadd('ErrorMsg', '\%>80v.\+', -1)
endif

" backspace in Visual mode deletes selection
vnoremap <BS>  d

" allow user to backspace as much as they want in insert mode
set backspace=2
set backspace=indent,eol,start

" save marks between sessions
set viminfo='1000,f1

" CTRL-X and SHIFT-Del are Cut
vnoremap <C-X> "+x
vnoremap <S-Del> "+x

" CTRL-C and CTRL-Insert are Copy
vnoremap <C-C> "+y
vnoremap <C-Insert> "+y

" Use CTRL-Q to do what CTRL-V used to do
noremap <C-Q>		<C-V>

" CTRL-V and SHIFT-Insert are Paste
nnoremap <silent> <SID>Paste "=@+.'xy'<CR>gPFx"_2x
map <C-V>		<SID>Paste
map <S-Insert>		<SID>Paste

imap <C-V>		x<Esc><SID>Paste"_s
imap <S-Insert>		x<Esc><SID>Paste"_s

cmap <C-V>		<C-R>+
cmap <S-Insert>		<C-R>+

vmap <C-V>		"-cx<Esc><SID>Paste"_x
vmap <S-Insert>		"-cx<Esc><SID>Paste"_x

" For CTRL-V to work autoselect must be off.
" On Unix we have two selections, autoselect can be used.
if !has("unix")
    set guioptions-=a
endif

" CTRL-Z is Undo; not in cmdline though
"noremap <C-Z> u
"inoremap <C-Z> <C-O>u

" CTRL-Y is Redo (although not repeat); not in cmdline though
noremap <C-Y> <C-R>
inoremap <C-Y> <C-O><C-R>

" Alt-Space is System menu
"if has("gui")
"noremap <M-Space> :simalt ~<CR>
"inoremap <M-Space> <C-O>:simalt ~<CR>
"cnoremap <M-Space> <C-C>:simalt ~<CR>
"endif

" CTRL-A is Select all
noremap <C-A> gggH<C-O>G
inoremap <C-A> <C-O>gg<C-O>gH<C-O>G
cnoremap <C-A> <C-C>gggH<C-O>G

" CTRL-Tab is Next window
noremap <C-Tab> <C-W>w
inoremap <C-Tab> <C-O><C-W>w
cnoremap <C-Tab> <C-C><C-W>w

" CTRL-F4 is Close window
noremap <C-F4> <C-W>c
inoremap <C-F4> <C-O><C-W>c
cnoremap <C-F4> <C-C><C-W>c


set number

set foldmethod=syntax
autocmd Syntax * normal zR
set cul
hi CursorLine guibg=black guifg=NONE ctermbg=235 ctermfg=NONE
hi Cursor guibg=white guifg=black
set nowrap
set lbr
set sw=2
set ts=2
set expandtab
set ai
set si

" Return to last edit position when opening files (You want this!)
autocmd BufReadPost *
     \ if line("'\"") > 0 && line("'\"") <= line("$") |
     \   exe "normal! g`\"" |
     \ endif

" Format the status line
set statusline=\ %{HasPaste()}%F%m%r%h\ %w\ \ CWD:\ %r%{getcwd()}%h\ \ \ Line:\ %l

" use ghc functionality for haskell files
"au Bufenter *.hs compiler ghc

"enable filetype detection, plus loading of filetype plugins
filetype plugin on


"Configure browser for haskell_doc.vim
"let g:haddock_browser = "open"
"let g:haddock_browser = "%s %s"

hi MBENormal guifg=lightblue ctermfg=lightblue

"-------------------------------------------------------------------------------
" Moving cursor to other windows
"
" shift down   : change window focus to lower one (cyclic)
" shift up     : change window focus to upper one (cyclic)
" shift left   : change window focus to one on left
" shift right  : change window focus to one on right
"------------------------------------------------------------------------------
nmap <c-j>   <c-w><down>
nmap <c-k>     <c-w><up>
nmap <c-h>   <c-w>h
nmap <c-l>  <c-w>l

" map a right hand leader key
nmap - <leader>

" Tags specific leader shortcuts
nmap <leader>l :TlistToggle<CR>

" NERDTree leader shortcuts
nmap <leader>n :NERDTreeToggle<CR>

" vim-slime configure for tmux
let g:slime_target = "tmux"

" configure ctrlp
let g:ctrlp_extensions = ['tag', 'buffertag', 'dir', 'undo', 'line', 'changes', 'mixed', 'bookmarkdir']
nmap <c-p><c-b> :CtrlPBuffer<CR>
nmap <c-p><c-m> :CtrlPMRU<CR>
nmap <c-p><c-t> :tjump
nmap <c-p><c-h> :CtrlPBufTag<CR>
nmap <c-p><c-d> :CtrlPDir<CR>
nmap <c-p><c-u> :CtrlPUndo<CR>
nmap <c-p><c-l> :CtrlPLine<CR>
nmap <c-p><c-c> :CtrlPChange<CR>
nmap <c-p><c-p> :CtrlP<CR>
nmap <c-p><c-y> :CtrlPBookmarkDir<CR>
nmap <c-p><c-x> :CtrlPMixed<CR>

" configure Gundo
nmap <leader>u :GundoToggle<CR>

" map minibuf exploreror
nmap <leader>mbt :MBEToggle<cr>

" Syntastic shortcuts
nmap <leader>se :Errors<cr>
nmap <leader>st  :SyntasticToggleMode<cr>
nmap <leader>sc  :SyntasticCheck<cr>

" tern shortcuts
nmap <leader>t] :TernDef<cr>
nmap <leader>td :TernDoc<cr>
nmap <leader>tt :TernType<cr>
nmap <leader>tr :TernRefs<cr>
nmap <leader>tm :TernRename<cr>

" Bundler shortcuts
nmap <leader>gem :Bopen
nmap <leader>gems :Bsplit
nmap <leader>gemv :Bvsplit
nmap <leader>bu  :Dispatch Bundle update<cr>
nmap <leader>bi  :Dispatch Bundle install<cr>

" Rails shortcuts
nmap <leader>rl :Rlog
nmap <leader>rp :Rpreview
nmap <leader>rg :Ctags<cr>
nmap <leader>rcd :Cd<cr>
nmap <leader>rlc :Lcd<cr>
nmap <leader>rc :Dispatch rails console<cr><c-b>o
nmap <leader>srv :Dispatch! rails s<cr>

" Rake shortcuts
nmap <leader>esp :Espec
nmap <leader>rk :Etask
nmap <leader>mi :Dispatch bundle exec rake db:migrate<cr>
nmap <leader>rs :Dispatch bundle exec rake db:reset<cr>
nmap <leader>cr :Dispatch bundle exec rake db:create<cr>
nmap <leader>sl :Dispatch bundle exec rake db:schema:load<cr>
nmap <leader>set :Dispatch bundle exec rake db:setup<cr>

" configure Fugitive
nmap <leader>g :Git
nmap <leader>gi :Git init<cr>
nmap <leader>gs :Gstatus<cr>
nmap <leader>gl :Dispatch git log<cr>
nmap <leader>gc :Dispatch git commit -m "PHAPPDEV-
nmap <leader>ga :Dispatch Git add .<cr>
nmap <leader>gpm :Dispatch Git push origin master<cr>
nmap <leader>gp :Dispatch Git push
nmap <leader>gb :Dispatch git checkout -b

" jump into pry shortcuts
" debug requiring the current file in pry from a tmux split
nmap <leader>pf :Dispatch pry -r %:p

nmap <leader>bl :buffers<cr>

" guard and spork
nmap <leader>gd :Dispatch! guard<cr>
nmap <leader>sp :Dispatch! spork<cr>

" run tests (rspec)
nmap <leader>tst :!rspec spec/

" generate ctags
nmap <leader>gt :Dispatch /usr/local/Cellar/ctags/5.8/bin/ctags -R --exclude=.git --tag-relative=yes *<cr>

" Don't close window, when deleting a buffer
command! Bclose call <SID>BufcloseCloseIt()
function! <SID>BufcloseCloseIt()
  let l:currentBufNum = bufnr("%")
  let l:alternateBufNum = bufnr("#")

  if buflisted(l:alternateBufNum)
    buffer #
  else
    bnext
  endif

  if bufnr("%") == l:currentBufNum
    new
  endif

  if buflisted(l:currentBufNum)
    execute("bdelete! ".l:currentBufNum)
  endif
endfunction

" Returns true if paste mode is enabled
function! HasPaste()
  if &paste
    return 'PASTE MODE  '
  endif

  return ''
endfunction
