import { Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { Container } from "../../components/Container/style";
import { Title } from "../../components/Title/style";
import { ButtonLinkWrapper } from "../ClinicSelectionScreen/style";
import UnsignedButton from "../../components/UnsignedButton";
import UnsignedLink from "../../components/UnsignedLink";
import DoctorCard from "../../components/DoctorCard";
import { CardsList } from "../../components/Card/style";
import { ScrollContainer } from "../../components/ScrollContainer/style";
import api, {apiUrlLocal} from "../../service/Service";


export default function DoctorSelectionScreen({ navigation }) {
  const [selectedDoctorId, setSelectedDoctorId] = useState(0);

  const [medicosLista, setMedicosLista] = useState([{ usuario: { id: '', foto: '', nome: '' }, especialidade: {especialidade1: ''} }]);

  async function ListarMedicos() {
    //instanciar chamada da api
    const url = `${apiUrlLocal}/Medicos`;
    const data = (await api.get(url)).data;

    console.log(url);

    console.log(data);
    setMedicosLista(data);
  }

  useEffect(() => {
    ListarMedicos();
  },[])

  return (
    <Container>
      <Title>Selecionar médico</Title>

      <ScrollContainer horizontal showsVerticalScrollIndicator={false}>
        <CardsList
          data={medicosLista}
          keyExtractor={(doctor) => doctor.usuario.id}
          contentContainerStyle={{ gap: 12 }}
          renderItem={({ item: medico }) => {
            console.log(medico);
           return(<TouchableOpacity
              onPress={() => setSelectedDoctorId(medico.usuario.id)}
            >
              <DoctorCard
                doctorImageUri={''}
                isSelected={medico.usuario.id == selectedDoctorId}
                medico={medico}
              />
            </TouchableOpacity>
          )

          }}
            
            
        />
      </ScrollContainer>

      <ButtonLinkWrapper>
        <UnsignedButton
          buttonText="Continuar"
          handleClickFn={() => navigation.navigate("dateSelection")}
        />
        <UnsignedLink
          linkText="Cancelar"
          handleClickFn={() => navigation.navigate("Main")}
        />
      </ButtonLinkWrapper>
    </Container>
  );
}
