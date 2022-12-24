document.querySelectorAll('.switch input').forEach(radio => {
	radio.addEventListener('change', () => {
		document.body.dataset.switch = radio.value;		
	})
})