// stop erase animations from firing on load
document.addEventListener("DOMContentLoaded",function(){
	document.querySelector("form").addEventListener("click",e => {
		let checkboxCL = e.target.classList,
			pState = "pristine";

		if (checkboxCL.contains(pState))
			checkboxCL.remove(pState);
	});
});