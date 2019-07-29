let documentsVue

// ---

// Loaded via <script> tag, create shortcut to access PDF.js exports.
const PDFJS = window['pdfjs-dist/build/pdf']
// The workerSrc property shall be specified.
PDFJS.GlobalWorkerOptions.workerSrc = '/js/lib/pdf.worker.js'

// ---

document.addEventListener('DOMContentLoaded', function() {
	documentsVue = new Vue({
		el: '#app',
		data: {
			pdfFile: '/uploads/sample.pdf',
			doc: {
				_id: 'abc123'
			}
		},

		methods: {
			renderPDF: function(url, canvasContainer) {
				let doc = this.doc
				function renderPage(page) {
					var wrapper = document.createElement('div')
					wrapper.className = 'canvas-wrapper'
					var canvas = document.createElement('canvas')
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

					wrapper.appendChild(canvas)
					canvasContainer.appendChild(wrapper)

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
				console.log(e.target.id)
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
			signDocument: function($event) {
				// let doc = this.selectedDocument

				// doc.isBeingEdited = true
				// doc.isBeingSigned = true

				let doccanvas = $event.target

				console.log(doccanvas)
				return

				var stage = new Konva.Stage({
					container: `konva-container${doc._id}`, // id of container <div>
					width: doccanvas.width,
					height: doccanvas.height
				})

				var layer = new Konva.Layer()
				var complexText = new Konva.Text({
					x: 20,
					y: 60,
					text: `Digitally Signed by:\n${doc.currentOfficer.name}\nOn: ${new moment()}\nTransaction ID: ${'123456'}.`,
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
			}
		},

		mounted: function() {
			M.AutoInit()
			this.renderPDF(this.pdfFile, document.getElementById('holder'))
		}
	})
})
