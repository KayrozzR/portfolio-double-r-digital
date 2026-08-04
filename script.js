const header=document.querySelector(".site-header");
const menuButton=document.querySelector(".menu-toggle");
const navigation=document.querySelector(".main-nav");
const navLinks=document.querySelectorAll(".main-nav a");
const yearElement=document.querySelector("#current-year");
const copyButton=document.querySelector("#copy-contact");
const copyFeedback=document.querySelector("#copy-feedback");

function updateHeader(){
  header?.classList.toggle("scrolled",window.scrollY>18);
}
function closeMenu(){
  navigation?.classList.remove("open");
  menuButton?.setAttribute("aria-expanded","false");
  menuButton?.setAttribute("aria-label","Ouvrir le menu");
  document.body.classList.remove("menu-open");
}
menuButton?.addEventListener("click",()=>{
  const isOpen=menuButton.getAttribute("aria-expanded")==="true";
  menuButton.setAttribute("aria-expanded",String(!isOpen));
  menuButton.setAttribute("aria-label",isOpen?"Ouvrir le menu":"Fermer le menu");
  navigation?.classList.toggle("open",!isOpen);
  document.body.classList.toggle("menu-open",!isOpen);
});
navLinks.forEach(link=>link.addEventListener("click",closeMenu));
window.addEventListener("scroll",updateHeader,{passive:true});
window.addEventListener("resize",()=>{if(window.innerWidth>820)closeMenu()});
updateHeader();

if(yearElement) yearElement.textContent=new Date().getFullYear();

const revealObserver=new IntersectionObserver((entries,observer)=>{
  entries.forEach(entry=>{
    if(!entry.isIntersecting)return;
    entry.target.classList.add("is-visible");
    observer.unobserve(entry.target);
  });
},{threshold:.12});
document.querySelectorAll(".reveal").forEach(element=>revealObserver.observe(element));

copyButton?.addEventListener("click",async()=>{
  const contact=copyButton.dataset.contact;
  if(!contact||contact.startsWith("À remplacer")){
    copyFeedback.textContent="Ajoute ton adresse e-mail dans l’attribut data-contact du bouton.";
    return;
  }
  try{
    await navigator.clipboard.writeText(contact);
    copyFeedback.textContent="Adresse e-mail copiée.";
    copyButton.textContent="E-mail copié ✓";
    setTimeout(()=>{
      copyButton.textContent="Copier mon e-mail";
      copyFeedback.textContent="";
    },2200);
  }catch(error){
    copyFeedback.textContent=`Adresse : ${contact}`;
  }
});