﻿using Microsoft.EntityFrameworkCore;
using WebAPI.Contexts;
using WebAPI.Domains;
using WebAPI.Interfaces;
using WebAPI.Utils;
using WebAPI.ViewModels;

namespace WebAPI.Repositories
{
    public class PacienteRepository : IPacienteRepository
    {
        VitalContext ctx = new VitalContext();

        public Paciente AtualizarPerfil(Guid Id, PacienteViewModel paciente)
        {
            try
            {
                Paciente pacienteBuscado = ctx.Pacientes
                .Include(x => x.Endereco)
                .FirstOrDefault(x => x.Id == Id)!;

                //if (paciente.Foto != null)
                //    pacienteBuscado!.IdNavigation.Foto = paciente.Foto;

                if (paciente.DataNascimento != null)
                    pacienteBuscado!.DataNascimento = paciente.DataNascimento;

                if (paciente.Cpf != null)
                    pacienteBuscado!.Cpf = paciente.Cpf;

                if (paciente.Logradouro != null)
                    pacienteBuscado!.Endereco!.Logradouro = paciente.Logradouro;

                if (paciente.Numero != null)
                    pacienteBuscado!.Endereco!.Numero = paciente.Numero;

                if (paciente.Cep != null)
                    pacienteBuscado!.Endereco!.Cep = paciente.Cep;

                if (paciente.Cidade != null)
                    pacienteBuscado!.Endereco!.Cidade = paciente.Cidade;

                ctx.Pacientes.Update(pacienteBuscado!);
                ctx.SaveChanges();

                return pacienteBuscado!;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public List<Consulta> BuscarPorData(DateTime dataConsulta, Guid idPaciente)
        {
            try
            {
                return ctx.Consultas
                 .Include(x => x.Situacao)
                 .Include(x => x.Prioridade)
                 .Include(x => x.Receita)
                 .Include(x => x.MedicoClinica)
                 .Include(x => x.MedicoClinica!.Medico)
                 .Include(x => x.MedicoClinica!.Medico!.Usuario)
                 .Include(x => x.MedicoClinica!.Medico!.Especialidade)
                 .Include(x => x.MedicoClinica!.Medico!.Usuario)
                 .Include(x => x.MedicoClinica!.Clinica)
                 .Include(x => x.MedicoClinica!.Clinica!.Endereco)
                 .Include(x => x.MedicoClinica!.Medico!.Especialidade)

                 // diferença em dias entre a Data da Consulta e a dataConsulta é igual a 0.
                 .Where(x => x.PacienteId == idPaciente && EF.Functions.DateDiffDay(x.DataConsulta, dataConsulta) == 0)
                 .ToList();
            }
            catch (Exception)
            {
                throw;
            }
        }

        public Paciente BuscarPorId(Guid Id)
        {
            try
            {
                return ctx.Pacientes
                    .AsNoTracking()
                    .Select(paciente => new Paciente
                    {
                        Id = paciente.Id,
                        DataNascimento = paciente.DataNascimento,
                        Rg = paciente.Rg,
                        Cpf = paciente.Cpf,
                        EnderecoId = paciente.EnderecoId,
                        Endereco = new Endereco
                        {
                            Cep = paciente.Endereco!.Cep,
                            Numero = paciente.Endereco.Numero,
                            Logradouro = paciente.Endereco.Logradouro,
                            Cidade = paciente.Endereco.Cidade
                        },
                        Usuario = paciente.Usuario
                    }).FirstOrDefault(x => x.Id == Id)!;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public void Cadastrar(Usuario user)
        {
            try
            {
                user.Senha = Criptografia.GerarHash(user.Senha!);
                ctx.Usuarios.Add(user);
                ctx.SaveChanges();
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}

