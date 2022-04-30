import React, { useEffect, useState } from 'react'
import { Box, Button, Center, Flex, Heading, HStack, Icon, Image, Input, InputGroup, Spacer, Text, Checkbox, Select } from '@chakra-ui/react'
import { useDispatch, useSelector } from 'react-redux'
import { getJenisProductAction, getProductAction, sortingProductAction } from '../redux/actions'
import { Link, useLocation } from 'react-router-dom'
import semuaProduct from '../assets/semua produk.png'
import { transform } from 'framer-motion'
import { Pagination } from '@mantine/core'
import { API_URL } from '../helper'
import LoadingPage from './LoadingPage'

const ProductPage = () => {

    const dispatch = useDispatch()
    const { state } = useLocation()
    const [jenisProduct, setJenisProduct] = useState('')
    const [valueJenis, setValueJenis] = useState('')
    const [valueMaterial, setValueMaterial] = useState('')
    const [valueProduct, setValueProduct] = useState('')
    const [valueSort, setvalueSort] = useState('')
    const [page, setPage] = useState(1)
    const [limitData, setLimitData] = useState(6)
    const [product, setProduct] = useState([])
    const [loading, setLoading] = useState(true)
    const { dataMaterial } = useSelector((state) => {
        return {
            dataMaterial: state.materialReducer.listMaterial
        }
    })
    useEffect(() => {
        getData()
    }, [state])

    const getData = async () => {
        try {
            setLoading(true)
            let dataJenis = await dispatch(getJenisProductAction(state.idkategori))
            let dataProduct = await dispatch(getProductAction(state.kategori))
            if (dataJenis.success && dataProduct.success) {
                setJenisProduct(dataJenis.dataJenisProduct)
                setProduct(dataProduct.data)
                setLoading(false)
            } else {
                setLoading(false)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const printMaterial = () => {
        if (dataMaterial.length > 0) {
            return dataMaterial.map((item, index) => {
                return (
                    <Box onClick={() => setValueMaterial(item.material)} >
                        <input type='radio' className='checkMaterial' name='material' id={item.material} />
                        <label for={item.material} >
                            <Center><Image src={`${API_URL}/${item.url}`} alt='images' boxSize={'60px'} /></Center>
                            <Text marginTop={'2vh'} >
                                {item.material}
                            </Text>
                        </label>
                    </Box>
                )
            })
        }
    }

    const printJenisProduct = () => {
        if (jenisProduct.length > 0) {
            return jenisProduct.map((item, index) => {
                return (
                    <Box cursor='pointer' onClick={() => setValueJenis(item.jenis_product)} >
                        <input type='radio' className='checkJenisProduct' name='jenis product' id={item.jenis_product} />
                        <label htmlFor={item.jenis_product}>
                            <Center>
                                <Image src={`${API_URL}/${item.url}`} alt='images' boxSize='30px' />
                            </Center>
                            <Text marginTop={'2vh'} fontSize='12px' fontWeight='medium'  >
                                {item.jenis_product}
                            </Text>
                        </label>
                    </Box>
                )
            })
        }
    }
    const printProduct = () => {
        if (product.length > 0) {
            return product.slice(page > 1 ? (page - 1) * limitData : page - 1, page * limitData).map((item, index) => {
                return (
                    <>
                        <Link to={`/detail/product?idproduct=${item.idproduct}`} state={item}  >
                            <Box maxW={'275px'} mt='80px' cursor='pointer' color='#6B3C3B' >
                                <Box display='flex'>
                                    <Box position='absolute'>
                                        <Image src={`${API_URL}/${item.material[0].url}`} zIndex='1' boxSize='45px' position='relative' top='-5px' left='30px' />
                                    </Box>
                                    <Box ml='85px'>
                                        <Text fontSize='15px' fontWeight='medium' top='-5px' position='relative'>{item.material[0].material}</Text>
                                    </Box>
                                </Box>
                                <Box maxW={'250px'} overflow='hidden' borderRadius='15px' boxShadow='lg' className='item-product'>
                                    <Image src={`${API_URL}/${item.images[0].url}`} width='100%' transition='transform 1.2s ease-in-out' _hover={{ transform: "scale(1.1)" }} />
                                    <Box position='absolute' display='none' >
                                        <Button position='relative' colorScheme='facebook' top='-35px' ml='75px' size='sm'  >Lihat product</Button>
                                    </Box>
                                </Box>
                                <Box p='3px'>
                                    <Center>
                                        <Box mt='2vh'>
                                            <Text fontWeight={'bold'} fontSize='18px' color={'grey'}>{item.nama.split(' ')[0]}</Text>
                                        </Box>
                                    </Center>
                                    <Center>
                                        <Text fontSize='15px' fontWeight='semibold'>{item.nama}</Text>
                                    </Center>
                                    <Center>
                                        <Text fontSize='20px' mt='2vh' fontWeight={'bold'}>IDR {item.harga.toLocaleString()}</Text>
                                    </Center>
                                </Box>
                            </Box>
                        </Link>
                    </>
                )
            })
        } else {
            return (
                <>
                    <Box my='20vh' mx='auto'>
                        <Heading as='h3' size='lg'>Produk tidak ada</Heading>
                    </Box>
                </>
            )
        }
    }
    const btFilter = async (valueJenis = null, valueMaterial = null) => {
        let jenis = valueJenis
        let material = valueMaterial
        let namaprod = valueProduct
        try {
            setLoading(true)
            let res = await dispatch(getProductAction(state.kategori, material, jenis, namaprod))
            if (res.success) {
                setProduct(res.data)
                setValueProduct('')
                setValueMaterial('')
                setValueJenis('')
                setLoading(false)
            }
        } catch (error) {
            console.log(error)
        }
    }
    const handleSort = async (event) => {
        let temp = event.split('-')
        try {
            let res = await dispatch(sortingProductAction(temp[0], temp[1]))
            if (res.success) {
                setProduct(res.data)
            }
        } catch (error) {
            console.log(error)
        }
    }
    const handleLImitData = (event) => {
        setLimitData(event.target.value)
        setPage(1)
    }

    return (
        <>
            {
                loading === true ?
                    <LoadingPage />
                    :
                    <>
                        <Box marginX={'15vw'} marginY={'5vh'} >
                            <Box my='5vh' >
                                <Input placeholder='Cari Product' w='700px' boxShadow='sm' onChange={(event) => setValueProduct(event.target.value)} />
                            </Box>
                            <Box>
                                <Box>
                                    <Text fontSize={'lg'} fontWeight='semibold'>
                                        Pilih Material Kayu
                                    </Text>
                                </Box>
                                <Box marginTop={'5vh'} marginLeft='2vw' >
                                    <HStack spacing={'50px'}>
                                        {printMaterial()}
                                    </HStack>
                                </Box>
                            </Box>
                            <Box mt='20vh' mb='15vh'>
                                <Box>
                                    <Text fontSize={'lg'} fontWeight='semibold' >
                                        Pilih Produk
                                    </Text>
                                </Box>
                                <Box marginTop={'5vh'} marginLeft='2vw'>
                                    <HStack spacing={'90px'}>
                                        <Box onClick={() => setValueJenis(null)}>
                                            <input type='radio' className='checkJenisProduct' name='jenis product' id='semua produk' />
                                            <label htmlFor="semua produk">
                                                <Center><Image src={semuaProduct} alt='images' boxSize='35px' /></Center>
                                                <Text marginTop={'2vh'} fontSize='12px'>
                                                    Semua Produk
                                                </Text>
                                            </label>
                                        </Box>
                                        {printJenisProduct()}
                                    </HStack>
                                </Box>
                            </Box>
                            <Box display='flex' justifyContent='end'>
                                <Button size='sm' colorScheme='blackAlpha' bgColor='#6b3c3b' onClick={() => btFilter(valueJenis, valueMaterial)}>Terapkan Filter</Button>
                            </Box>
                        </Box>
                        <hr></hr>
                        <Box marginX={'15vw'} marginY={'5vh'} >
                            <Box w='250px' ml='auto' my='30px'>
                                <Select placeholder='Sorting berdasarkan' onChange={(event) => handleSort(event.target.value)}>
                                    <option value="harga-asc">Harga Asc</option>
                                    <option value="harga-desc">Harga Desc</option>
                                    <option value="nama-asc">A - Z</option>
                                    <option value="nama-desc">Z - A</option>
                                    <option value="idproduct-asc">Reset</option>
                                </Select>
                            </Box>
                            <Box display={'flex'} justifyContent='space-between' flexWrap={'wrap'} >
                                {printProduct()}
                            </Box>
                            <Box mt='80px' mb='40px'>
                                <Center>
                                    <InputGroup>
                                        <Select w='20' mr='5' onChange={(event) => handleLImitData(event)}>
                                            <option selected value="6">6</option>
                                            <option value="9">9</option>
                                            <option value="12">12</option>
                                            <option value="15">15</option>
                                            <option value="18">18</option>
                                        </Select>
                                        <Pagination total={Math.ceil(product.length / limitData)} page={page} onChange={(event) => setPage(event)} size='lg' radius='xl' color='dark' />
                                    </InputGroup>
                                </Center>
                            </Box>
                        </Box>
                    </>
            }
        </>
    )
}

export default ProductPage