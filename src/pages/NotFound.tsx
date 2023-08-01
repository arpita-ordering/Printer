import React from 'react'
import { Container, NotFoundSource } from 'ordering-ui-native-release/themes/business'
import { useSession, useLanguage } from 'ordering-components-external/native'

const NotFound = ({navigation} : any) => {
  const [{auth}] = useSession()
  const [ ,t] = useLanguage()

  const btnTitle = !auth ? t('GO_TO_HOMEPAGE', 'Go to homepage') : t('GO_TO_BUSINESSLIST', 'Go to business list')

  const handleNavigate = () => {
    auth ? navigation.navigate('BusinessList') : navigation.navigate('Home')
  }
  return (
    <Container>
      <NotFoundSource btnTitle={btnTitle} content={t('PAGE_NOT_FOUND' , 'Page not found')} onClickButton={handleNavigate}/>
    </Container>
  )
}

export default NotFound
