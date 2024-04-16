<<<<<<< HEAD
﻿using Microsoft.AspNetCore.Http;
=======
﻿using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.AspNetCore.Http;
>>>>>>> develop
using Microsoft.AspNetCore.Mvc;
using WebAPI.Domains;
using WebAPI.Utils.OCR;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
<<<<<<< HEAD
    public class OcrController : ControllerBase
    {
        private readonly OcrService _ocrService;

        public OcrController(OcrService ocrService)
        {
            _ocrService = ocrService;
        }

        [HttpPost]
        public async Task<IActionResult> recognizeText([FromForm] FileUploadModel fileUploadModel)
        {
            try
            {
                if (fileUploadModel == null || fileUploadModel.Image == null)
                {
                    return BadRequest("Nenhuma imagem foi fornecida.");
                }

                string result;

                using (var stream = fileUploadModel.Image.OpenReadStream())
                {
                    result = await _ocrService.RecognizeTextAsync(stream);
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
=======
    public class OrcController : ControllerBase
    {
        private readonly OcrService _ocrService;

        public OrcController(OcrService orcService)
        {
            _ocrService = orcService;
        }

        [HttpPost]
        public async Task<IActionResult> RecognizeText([FromForm] FileUploadModel fileUploadModel)
        {
            try
            {
                //Verifica se a imagem foi recebida
                if (fileUploadModel == null || fileUploadModel.Image == null)
                {
                    return BadRequest("Nenhuma imagem foi fornecida");
                }

                //abre a conexão com o recurso
                using (var stream = fileUploadModel.Image.OpenReadStream())
                {
                    //chama o método para reconhecer a  imagem
                    var result = await _ocrService.RecognizeTextAsync(stream);

                    //retorna o resultado
                    return Ok(result);
                }
            }
            catch (Exception ex)
            {
                return BadRequest("Erro ao processar a imagem" + ex.Message);
>>>>>>> develop
            }
        }
    }
}
