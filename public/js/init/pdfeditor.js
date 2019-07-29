let documentsVue

// ---

// Loaded via <script> tag, create shortcut to access PDF.js exports.
const pdfjsLib = window['pdfjs-dist/build/pdf']
// The workerSrc property shall be specified.
pdfjsLib.GlobalWorkerOptions.workerSrc = '/js/lib/pdf.worker.js'

// ---

document.addEventListener('DOMContentLoaded', function() {
	documentsVue = new Vue({
		el: '#app',
		data: {},

		methods: {},

		mounted: function() {}
	})
})
