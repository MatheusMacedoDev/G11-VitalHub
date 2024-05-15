import React, { useEffect } from 'react'
import { Title } from '../Title/style';
import { CommandText } from '../CommandText/style';
import UnsignedButton from '../UnsignedButton';
import UnsignedLink from '../UnsignedLink'
import Modal from '../Modal';
import { CancelConsultation } from '../../service/consultationService';
import { DoctorCancelNotify, PatientCancelNotify } from '../../../utils/notifications';

export default function CancelConsultationModal({ active, disableModalFn = null, consultationId, consultationData, updateConsultations = null, isDoctor }) {
  return (
    <Modal active={active}>
      <Title marginTop={0}>Cancelar consulta</Title>
      <CommandText>Ao cancelar essa consulta, abrirá uma possível disponibilidade no seu horário, deseja mesmo cancelar essa consulta?</CommandText>
      <UnsignedButton 
        handleClickFn={async setIsLoading => {
          await CancelConsultation(consultationId);
          await updateConsultations();

          setIsLoading(false);
          disableModalFn();

          if (isDoctor) {
            await DoctorCancelNotify(
              consultationData.patientName,
              consultationData.consultationDate,
              consultationData.consultationTime
            );
          } else {
            await PatientCancelNotify(
              consultationData.doctorName,
              consultationData.selectedDoctorSpecialty,
              consultationData.consultationDate,
              consultationData.consultationTime
            );
          }
        }}
        buttonText='Confirmar'
      />
      <UnsignedLink 
        handleClickFn={disableModalFn}
        linkText='Cancelar'
      />
    </Modal>
  )
}