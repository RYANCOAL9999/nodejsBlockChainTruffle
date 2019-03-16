function draw(url)
{
    //
    // In cases when the pdf.worker.js is located at the different folder than the
    // PDF.js's one, or the PDF.js is executed via eval(), the workerSrc property
    // shall be specified.
    //

    pdfjsLib.GlobalWorkerOptions.workerSrc =
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.2.2/pdf.worker.js';

    var pdfDoc = null;
    var pageNum = 1;
    var pageRendering = false;
    var pageNumPending = null;                       
    var scale = 2;                                  
    var canvas = document.getElementById('the-canvas');
    var content = canvas.getContext('2d');
    /**
     * Get page info from document, resize canvas accordingly, and render page.
     * @param num Page number.
     */
    function renderPage(num) 
    {
        pageRendering = true;
        // Using promise to fetch the page
        pdfDoc.getPage(num).then(function(page) 
        {
            content.textAlign = 'center';
            var viewport = page.getViewport({ scale: scale, });
            canvas.height = viewport.height;
            canvas.width = viewport.width;
        // Render PDF page into canvas context
            var renderContext = {
                canvasContext: content,
                viewport: viewport,
            };
            var renderTask = page.render(renderContext);
            // Wait for rendering to finish
            renderTask.promise.then(function () 
            {
                pageRendering = false;
                if (pageNumPending !== null) 
                {
                    // New page rendering is pending
                    renderPage(pageNumPending);
                    pageNumPending = null;
                }
            });
        });
        // Update page counters
        document.getElementById('page_num').textContent = num;
    }
    /**
     * If another page rendering in progress, waits until the rendering is
     * finised. Otherwise, executes rendering immediately.
     */
    function queueRenderPage(num) 
    {
        if (pageRendering) 
        {
            pageNumPending = num;
        } 
        else 
        {
            renderPage(num);
        }
    }
    /**
     * Displays previous page.
     */
    function onPrevPage() 
    {
        if (pageNum <= 1) 
        {
            return;
        }
        pageNum--;
        queueRenderPage(pageNum);
    }
    document.getElementById('prev').addEventListener('click', onPrevPage);
    /**
     * Displays next page.
     */
    function onNextPage() 
    {
        if (pageNum >= pdfDoc.numPages) 
        {
            return;
        }
        pageNum++;
        queueRenderPage(pageNum);
    }
    document.getElementById('next').addEventListener('click', onNextPage);
    
    /**
     * Asynchronously downloads PDF.
     */
    var loadingTask = pdfjsLib.getDocument(url);
    loadingTask.promise.then(function(pdfDoc_) 
    {
        pdfDoc = pdfDoc_;
        document.getElementById('page_count').textContent = pdfDoc.numPages;
        // Initial/first page rendering
        renderPage(pageNum);
    });
}



