let editorVue

// ---

// Loaded via <script> tag, create shortcut to access PDF.js exports.
const PDFJS = window['pdfjs-dist/build/pdf']
// The workerSrc property shall be specified.
PDFJS.GlobalWorkerOptions.workerSrc = '/js/lib/pdf.worker.js'

// ---

document.addEventListener('DOMContentLoaded', function() {
	editorVue = new Vue({
		el: '#app',
		data: {
			pdfFile: '/uploads/sample.pdf',
			doc: {
				_id: 'abc123'
			},
			selectedCanvas: '',
			selectedCanvasContainer: ''
		},

		methods: {
			renderPDF: function(url, canvasContainer) {
				let doc = this.doc
				function renderPage(page) {
					var pageContainer = document.createElement('div')
					pageContainer.className = 'page-container'
					pageContainer.id = `${doc._id}_pageContainer_page${page.pageIndex}`

					var canvas = document.createElement('canvas')
					addClass(canvas, 'page-content')
					console.log(page)
					canvas.id = `${doc._id}_page${page.pageIndex}`
					var ctx = canvas.getContext('2d')

					// console.log(canvasContainer.style.width)

					var viewport = page.getViewport(1 /* canvasContainer.width / page.getViewport(1.0).width */)
					var renderContext = {
						canvasContext: ctx,
						viewport: viewport
					}
					canvas.height = viewport.height
					canvas.width = viewport.width


					pageContainer.appendChild(canvas)
					canvasContainer.appendChild(pageContainer)

					page.render(renderContext)
				}

				function renderPages(pdfDoc) {
					for (var num = 1; num <= pdfDoc.numPages; num++) pdfDoc.getPage(num).then(renderPage)
				}

				PDFJS.disableWorker = true
				PDFJS.getDocument(url).then(renderPages)
			},

			showContextMenu: function(e, doc) {
				// this.selectedDocument = doc
				// console.log(e.clientX + ',' + e.clientY)
				// console.log(e.target.id)
				this.selectedCanvas = e.target.id
				this.selectedCanvasContainer = e.target.parentElement.id
				let cntnr = document.getElementById('cntnr')
				cntnr.style.left = e.clientX
				cntnr.style.top = e.clientY
				// $("#cntnr").hide(100);
				cntnr.style.display = 'block'

				document.addEventListener('click', function hidemenu() {
					cntnr.style.display = 'none'
					document.removeEventListener('click', hidemenu)
				})
			},
			signDocument: function(event) {
				// let doc = this.selectedDocument

				// doc.isBeingEdited = true
				// doc.isBeingSigned = true

				let doccanvas = document.getElementById(this.selectedCanvas)
				let konvaContainer = document.createElement('div')
				konvaContainer.id = `${this.selectedCanvas}_konva`
				addClass(konvaContainer, 'konva-container')

				document.getElementById(this.selectedCanvasContainer).appendChild(konvaContainer)

				// console.log(doccanvas.style)
				console.log(getComputedStyle(doccanvas))
				// return

				var stage = new Konva.Stage({
					container: konvaContainer.id, // id of container <div>
					width: doccanvas.width,
					height: doccanvas.height
				})

				var layer = new Konva.Layer()
				var complexText = new Konva.Text({
					x: 20,
					y: 60,
					text: `Digitally Signed by:\n${'Krushn Dayshmookh'}\nOn: ${new moment()}\nTransaction ID: ${'123456'}.`,
					fontSize: 16,
					fontFamily: 'Calibri',
					fill: '#555',
					width: 300,
					padding: 5,
					align: 'left'
				})

				var rect = new Konva.Rect({
					x: 20,
					y: 60,
					stroke: '#555',
					strokeWidth: 1,
					fill: '#ffffff',
					width: 175,
					height: complexText.height(),
					cornerRadius: 2
				})
				var group = new Konva.Group({
					draggable: true
				})
				// add the shapes to the layer

				group.add(rect)
				group.add(complexText)

				layer.add(group)
				// add the layer to the stage
				stage.add(layer)

				layer.draw()

				let konvacanvas = konvaContainer.querySelector('canvas')
				// console.log(konvacanvas)

				konvaContainer.style.position = `relative`
				konvaContainer.style.top = `-${konvacanvas.height}`
				konvaContainer.parentElement.style.height = konvacanvas.height

			}
		},

		mounted: function() {
			M.AutoInit()
			this.renderPDF(this.pdfFile, document.getElementById('holder'))
		}
	})
})
