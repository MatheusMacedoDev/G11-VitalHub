import React, { useEffect, useState } from 'react'
import UserMainInfo from '../../components/UserMainInfo'
import { UserProfileImage } from '../../components/UserImage/style'
import { Container } from '../../components/Container/style'
import { InputText, InternalInputsWrapper } from '../../components/InternalInput/style'
import InternalTextArea from '../../components/InternalTextArea'
import UnsignedButton from '../../components/UnsignedButton'
import { UnsignedButtonsWrapper } from '../../components/UnsignedButton/style'
import { ScrollContainer } from '../../components/ScrollContainer/style';
import { SplitedTextAreasContainer } from '../../components/InternalTextArea/style'
import { logout, userDecodeToken } from '../../utils/Auth'
import { AtualizarPerfilMedico, AtualizarPerfilPaciente, BuscarMedicoPorId, BuscarPacientePorId, GetSpecialties } from '../../service/userService'
import { SelectList } from 'react-native-dropdown-select-list'

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
    const [specialtyId, setSpecialtyId] = useState('');
    const [crm, setCrm] = useState('');
    const [selectSpecialtiesData, setSelectSpecialtiesData] = useState([])

    // General data
    const [neighborhood, setNeighborhood] = useState('')
    const [number, setNumber] = useState('')
    const [cep, setCep] = useState('');
    const [city, setCity] = useState('');
    const [token, setToken] = useState('');

    const [isEditing, setIsEditing] = useState(false);

    async function loadData() {
        const token = await userDecodeToken();
        setUserName(token.name);
        setEmail(token.email);
        setId(token.id);
        setRole(token.role);
        setToken(token.token);
        
        if (token.role == 'Paciente') {
            const patientData = await BuscarPacientePorId(token.id);

            setBirthDate(patientData.birthDate);
            setCpf(patientData.cpf);

            setNeighborhood(patientData.neighborhood);
            setNumber(patientData.number);
            setCep(patientData.cep);
            setCity(patientData.city)
        } else if (token.role == 'Medico') {
            const doctorData = await BuscarMedicoPorId(token.id)
            const specialtiesData = await GetSpecialties();

            const specialtiesSelectData = specialtiesData.map(specialty => ({
                key: specialty.id,
                value: specialty.especialidade1
            }))

            setSelectSpecialtiesData(specialtiesSelectData);

            setCrm(doctorData.crm)
            setSpecialtyId(doctorData.specialtyId)
            setSpecialty(doctorData.specialty)
            
            setNeighborhood(doctorData.neighborhood);
            setNumber(doctorData.number);
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
                                labelText="Data de nascimento:"
                                textArea={birthDate}
                                handleChangeFn={setBirthDate}
                                isEditing={isEditing}
                            />
                            <InternalTextArea 
                                labelText="CPF"
                                textArea={cpf}
                                handleChangeFn={setCpf}
                                isEditing={isEditing}
                            />
                        </>
                    ) : (
                        <>
                            {
                                isEditing ? (
                                    <>
                                        <InputText fontSize={16}>Especialidade:</InputText>
                                        <SelectList 
                                            setSelected={key => {
                                                setSpecialtyId(key)
                                            }} 
                                            data={selectSpecialtiesData} 
                                            save="key"
                                            defaultOption={{ key: specialtyId, value: specialty }}
                                        />
                                    </>
                                ) : (
                                    <InternalTextArea 
                                        labelText="Especialidade:"
                                        textArea={specialty}
                                        handleChangeFn={setSpecialty}
                                        isEditing={isEditing}
                                    />
                                )
                            }
                            <InternalTextArea 
                                labelText="CRM"
                                textArea={crm}
                                handleChangeFn={setCrm}
                                isEditing={isEditing}
                            />
                        </>
                    )
                }
                <SplitedTextAreasContainer>
                    <InternalTextArea 
                        labelText="Logradouro"
                        textArea={neighborhood}
                        widthPercentage={45}
                        handleChangeFn={setNeighborhood}
                        isEditing={isEditing}
                    />
                    <InternalTextArea 
                        labelText="Número"
                        textArea={number}
                        widthPercentage={45}
                        handleChangeFn={setNumber}
                        isEditing={isEditing}
                    />
                </SplitedTextAreasContainer>
                <SplitedTextAreasContainer>
                    <InternalTextArea 
                        widthPercentage={45}
                        labelText="Cep"
                        textArea={cep}
                        handleChangeFn={setCep}
                        isEditing={isEditing}
                    />
                    <InternalTextArea 
                        widthPercentage={45}
                        labelText="Cidade"
                        textArea={city}
                        handleChangeFn={setCity}
                        isEditing={isEditing}
                    />
                </SplitedTextAreasContainer>
            </InternalInputsWrapper>
            <UnsignedButtonsWrapper>
                {
                    isEditing ? (
                        <UnsignedButton 
                            buttonText='Salvar'
                            handleClickFn={async setIsLoading => {
                                setIsEditing(false);


                                if (role == 'Paciente') {
                                    await AtualizarPerfilPaciente(
                                        token,
                                        birthDate,
                                        neighborhood,
                                        number,
                                        cep,
                                        city    
                                    )
                                } else if (role == 'Medico') {
                                    await AtualizarPerfilMedico(
                                        token,
                                        specialtyId,
                                        crm,
                                        neighborhood,
                                        number,
                                        cep,
                                        city
                                    )
                                }

                                await loadData()

                                setIsLoading(false);
                            }}
                        />
                    ) : (
                        <UnsignedButton 
                            buttonText='Editar'
                            handleClickFn={setIsLoading => {
                                setIsEditing(true)
                                setIsLoading(false);
                            }}
                        />
                    )
                }
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