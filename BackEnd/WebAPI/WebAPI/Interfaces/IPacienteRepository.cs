﻿using WebAPI.Domains;
using WebAPI.ViewModels;

namespace WebAPI.Interfaces
{
    public interface IPacienteRepository
    {
        /// <summary>
        /// Cadastra um novo paciente junto ao seu usuário
        /// </summary>
        /// <param name="paciente">Usuario com os dados do paciente na propriedade Paciente</param>
        public void Cadastrar(Usuario paciente);

        public List<Consulta> BuscarPorData(DateTime dataConsulta, Guid id);

        public Paciente BuscarPorId(Guid Id);

        public Paciente AtualizarPerfil(Guid id, PacienteViewModel paciente);
       

       
    }
}
