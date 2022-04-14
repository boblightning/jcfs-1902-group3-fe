import { Box, Button, Heading, Image, InputGroup, Select, Text } from '@chakra-ui/react'
import { Pagination } from '@mantine/core'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import MenuManagement from '../Components/MenuManagement'
import ModalUploadReceipt from '../Components/ModalUploadReceipt'

const MenungguPembayaranPage = () => {
    const [openModal, setOpenModal] = useState(false)
    const [detail, setDetail] = useState({})
    const [page, setPage] = useState(1)
    const [limitData, setLimitData] = useState(5)
    const { transaksiUser } = useSelector((state) => {
        return {
            transaksiUser: state.transactionReducer.transaksi
        }
    })
    const handleModal = (open, item) => {
        setOpenModal(open)
        setDetail(item)
    }
    const printTransaksi = () => {
        if (transaksiUser.length > 0) {
            return transaksiUser.slice(page > 1 ? (page - 1) * limitData : page - 1, page * limitData).map((item, index) => {
                return (
                    <>
                        <Box borderRadius='10px' my='20px' w='100%' p='3' boxShadow='md'>
                            <Box display='flex' w='100%' justifyContent='space-between'>
                                <Box>
                                    <Text fontWeight='semibold'>Belanja {item.added_date.substr(0, 10)}</Text>
                                </Box>
                            </Box>
                            <Box my='15px' display='flex' justifyContent='space-between'>
                                <Box>
                                    <Text fontWeight='semibold'>Invoice</Text>
                                    <Text mr='10px'>{item.invoice}</Text>
                                </Box>
                                <Box>
                                    <Text fontWeight='semibold'>Total Pembayaran</Text>
                                    <Text mr='10px'>Rp.{(item.total_tagihan).toLocaleString()}</Text>
                                </Box>
                                <Box>
                                    <Button size='sm' mt='15px' colorScheme='facebook' onClick={() => handleModal(true, item)}>Cara Pembayaran</Button>
                                </Box>
                            </Box>
                        </Box>
                    </>
                )
            })
        }
    }
    const handleLImitData = (event) => {
        setLimitData(event.target.value)
        setPage(1)
    }
    return (
        <>
            {/* {console.log('isi transaksi', transaksiUser)} */}
            <Box mx='60px' my='20px'>
                <Box display='flex'>
                    <MenuManagement />
                    <Box ml='20px'>
                        <Heading as='h3' size='lg'>
                            Menunggu Pembayaran
                        </Heading>
                        <Box w='68vw' my='4vh' p='6' borderRadius='15px' border={'2px solid #F3F4F5'}>
                            {printTransaksi()}
                            <ModalUploadReceipt open={openModal} onClose={() => setOpenModal(!openModal)} detailTrans={detail} />
                            <Box mt='40px' mb='10px' display='flex' justifyContent='center'>
                                <Box display='flex'>
                                    <Select w='20' mr='5' onChange={(event) => handleLImitData(event)}>
                                        <option selected value="5">5</option>
                                        <option value="10">10</option>
                                        <option value="15">15</option>
                                        <option value="20">20</option>
                                        <option value="25">25</option>
                                    </Select>
                                    <Pagination total={Math.ceil(transaksiUser.length / limitData)} page={page} onChange={(event) => setPage(event)} size='lg' radius='xl' color='dark' />
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </>
    )
}

export default MenungguPembayaranPage