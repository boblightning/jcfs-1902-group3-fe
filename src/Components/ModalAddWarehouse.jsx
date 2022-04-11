import axios from 'axios';
import React from 'react';
import { connect } from 'react-redux';
import { Button, FormGroup, Input, InputGroup, Label, Modal, ModalBody, ModalHeader } from 'reactstrap';
import Swal from 'sweetalert2';
import { API_URL } from '../helper';
import { getWarehouse } from '../redux/actions/userAction';

class ModalAddWarehouse extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            provinsi: [],
            kota: [],
            nama: '',
            alamat: '',            
            idprovinsi: null,
            idkota: null,
            kecamatan: '',
            kode_pos: null
        }
    }
    // nama_penerima, alamat, no_telpon, provinsi, kota, kecamatan, kode_pos
    btSimpan = async() => {
        const {nama, alamat, kecamatan, kode_pos, idprovinsi, idkota} = this.state
        let data = {
            idprovinsi,
            idkota,
            nama,
            alamat,            
            kecamatan,
            kode_pos
        }
        let token = localStorage.getItem('data')
        let res = await axios.post(`${API_URL}/admin/addwarehouse`, data, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        // if(res.data.success){
            .then(res => {
                console.log("cek res.data", res.data)
                return Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Berhasil Tambah Warehouse',
                    showConfirmButton: false,
                    timer: 1500
                })
            }).then(result => {                
                this.props.btClose()
                this.props.getWarehouse()
            })
            .catch((err) => {
                console.log(err)
            })
        // }
        // if(res.data.success){
        //     alert("Berhasil Tambah Warehouse")
        //     this.props.btClose();
        //     this.props.getWarehouse();
        // }
    }
    getData = async () => {
        try {
            let res = await axios.get(`${API_URL}/alamat/provinsi`)
            if (res.data.success) {
                this.setState({
                    provinsi: res.data.dataProvinsi
                })
            }
        } catch (error) {
            console.log(error)
        }
    }
    printProvinsi = () => {
        if (this.state.provinsi.length > 0) {
            return this.state.provinsi.map((item, index) => {
                return (
                    <option value={item.province_id}>{item.province}</option>
                )
            })
        }
    }
    handleKota = async(event) => {
        let res = await axios.get(`${API_URL}/alamat/kota/${event.target.value}`)
        if(res.data.success){
            this.setState({
                kota: res.data.dataKota
            })
        }
        this.setState({
            idprovinsi: event.target.value
          })
    }
    printKota = () => {
        if (this.state.kota.length > 0) {
            return this.state.kota.map((item, index) => {
                return (
                    <option value={item.city_id}>{item.city_name}</option>
                )
            })
        }
    }
    handleInput = (event,nameProp) => {
        this.setState({
            [nameProp]: event.target.value
        })
    }
    componentDidMount() {
        this.getData()
    }


    render() {
        // console.log("cek provinsi", this.state.provinsi)
        return (
            <div>
                <Modal
                centered
                    style={{}}
                    isOpen={this.props.ModalAddWarehouse}
                    toggle={this.props.btClose}
                    size='lg'
                >
                    <ModalHeader style={{ margin: "auto" }}>
                        Add Warehouse
                    </ModalHeader>
                    <ModalBody>
                        {/* <Input type='textarea' innerRef={(element) => this.inNama_Penerima = element} /> */}
                        <FormGroup>
                            <Label>Nama</Label>
                            <Input placeholder='nama' onChange={(event) => this.handleInput(event, 'nama')}/>
                        </FormGroup>
                        <InputGroup className='d-flex justify-content-between '>
                            <FormGroup style={{ width: '400px' }}>
                                <Label>Provinsi</Label>
                                <Input type='select' placeholder='Provinsi' onChange={(event) => this.handleKota(event)}>
                                    <option value='Provinsi' selected>Pilih Provinsi</option>
                                    {this.printProvinsi()}
                                </Input>
                            </FormGroup>
                            <FormGroup style={{ width: '300px' }}>
                                <Label>Kota</Label>
                                <Input type='select' placeholder='Kota' onChange={(event) => this.handleInput(event, 'idkota')}>
                                    <option value='Kota' selected>Pilih Kota</option>
                                    {this.printKota()}
                                </Input>
                            </FormGroup>
                        </InputGroup>
                        <InputGroup className='d-flex justify-content-between'>
                            <FormGroup>
                                <Label>Kecamatan</Label>
                                <Input type='text' placeholder='kecamatan' onChange={(event) => this.handleInput(event, 'kecamatan')} />
                            </FormGroup>
                            <FormGroup >
                                <Label>Kode Pos</Label>
                                <Input type='number' placeholder='kode pos' onChange={(event) => this.handleInput(event, 'kode_pos')} />
                            </FormGroup>
                            {/* <FormGroup>
                                <Label>No Telepon</Label>
                                <Input type='number' placeholder='no telepon' onChange={(event) => this.handleInput(event, 'no_telpon')} />
                            </FormGroup> */}
                        </InputGroup>
                        <FormGroup>
                            <Label>Alamat Lengkap</Label>
                            <Input type='textarea' placeholder='alamat lengkap' onChange={(event) => this.handleInput(event, 'alamat')} />
                        </FormGroup>
                        <div style={{ float: "right", marginTop: 20 }}>
                            <Button onClick={this.btSimpan} style={{ borderRadius: 10 }} className='bt-orange'>
                                Simpan
                            </Button>
                        </div>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}

const mapToProps = (state) => {
    return {
        iduser: state.userReducer.iduser,
        warehouseList: state.userReducer.warehouseList,
    }
}
// nama_penerima, alamat, no_telpon, provinsi, kota, kecamatan, kode_pos

export default connect(mapToProps, { getWarehouse })(ModalAddWarehouse);