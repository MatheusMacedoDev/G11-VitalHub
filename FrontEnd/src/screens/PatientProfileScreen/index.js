import React, { useEffect, useState } from 'react'
import UserMainInfo from '../../components/UserMainInfo'
import { UserProfileImage } from '../../components/UserImage/style'
import { Container } from '../../components/Container/style'
import { InternalInputsWrapper } from '../../components/InternalInput/style'
import InternalTextArea from '../../components/InternalTextArea'
import UnsignedButton from '../../components/UnsignedButton'
import { UnsignedButtonsWrapper } from '../../components/UnsignedButton/style'
import { ScrollContainer } from '../../components/ScrollContainer/style';
import { SplitedTextAreasContainer } from '../../components/InternalTextArea/style'
import { logout, userDecodeToken } from '../../utils/Auth'
import { BuscarMedicoPorId, BuscarPacientePorId } from '../../service/userService'

export default function PatientProfileScreen({ navigation }) {
    // User data
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [id, setId] = useState("");
    const [role, setRole] = useState("");

    // Patient data
    const [birthDate, setBirthDate] = useState('');
    const [cpf, setCpf] = useState('');

    // Doctor data
    const [specialty, setSpecialty] = useState('');
    const [crm, setCrm] = useState('');

    // General data
    const [address, setAddress] = useState('');
    const [cep, setCep] = useState('');
    const [city, setCity] = useState('Moema-SP');

    async function loadData() {
        const token = await userDecodeToken();
        setUserName(token.name);
        setEmail(token.email);
        setId(token.id);
        setRole(token.role)
        
        if (token.role == 'Paciente') {
            const patientData = await BuscarPacientePorId(token.id);

            setBirthDate(patientData.birthDate);
            setCpf(patientData.cpf);

            setAddress(patientData.address);
            setCep(patientData.cep);
            setCity(patientData.city)
        } else if (token.role == 'Medico') {
            const doctorData = await BuscarMedicoPorId(token.id)

            setCrm(doctorData.crm)
            setSpecialty(doctorData.specialty)
            
            setAddress(doctorData.address);
            setCep(doctorData.cep);
            setCity(doctorData.city)
        } else {
            alert('Invalid role!')
        }
    }

    useEffect(() => {
        loadData();
    }, [])
    
    return (
        <ScrollContainer>
        <UserProfileImage 
            resizeMode="cover"
            source={require('../../assets/user-profile-image.png')} 
        />
        <Container>
            <UserMainInfo 
                username={userName}
                infoArr={[ 
                    email
                ]}
            />
            <InternalInputsWrapper>
                {
                    role === 'Paciente' ? (
                        <>
                            <InternalTextArea 
                                inputText="Data de nascimento:"
                                textArea={birthDate}
                            />
                            <InternalTextArea 
                                inputText="CPF"
                                textArea={cpf}
                            />
                        </>
                    ) : (
                        <>
                            <InternalTextArea 
                                inputText="Especialidade:"
                                textArea={specialty}
                            />
                            <InternalTextArea 
                                inputText="CRM"
                                textArea={crm}
                            />
                        </>
                    )
                }
                <InternalTextArea 
                    inputText="Endereço"
                    textArea={address}
                />
                <SplitedTextAreasContainer>
                    <InternalTextArea 
                        widthPercentage={45}
                        inputText="Cep"
                        textArea={cep}
                    />
                    <InternalTextArea 
                        widthPercentage={45}
                        inputText="Cidade"
                        textArea={city}
                    />
                </SplitedTextAreasContainer>
            </InternalInputsWrapper>
            <UnsignedButtonsWrapper>
                <UnsignedButton 
                    buttonText='Salvar'
                />
                <UnsignedButton 
                    buttonText='Editar'
                />
                <UnsignedButton 
                    handleClickFn={() => {
                        logout();
                        navigation.replace('login');
                    }}
                    buttonText='Sair'
                />
            </UnsignedButtonsWrapper>
        </Container>
        </ScrollContainer>
    )
}