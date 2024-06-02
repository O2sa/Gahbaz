import { Title, Text, Container, Grid, Image, Button } from '@mantine/core'
import limeSrfImg from '../../../assets/images/landing_imgs/lime-surfing.png'

const SectionTwo = () => {
  //const theme = useMantineTheme();

  return (
    <section id="section-two">
      <Container>
        <Grid justify="space-around">
          <Grid.Col xs={6} sm={8} md={8} lg={8}>
            <div style={{ marginBottom: 20 }}>
              <Text color="black">
                <Title order={1}>لا تحتاج سوى جهاز متصل بالأنترنت!</Title>النظام مبني على أن يكون
                سحابيا بشكل كامل حيث تخزن جميع البيانات سحابيا مع وجوع مساحة غير محدودة{' '}
              </Text>
            </div>
            <Button >التفاصيل</Button>
          </Grid.Col>
          <Grid.Col xs={6} sm={4} md={4} lg={4}>
            <Image src={'https://o2sa.github.io/assets/img/projects_imgs/elearning/img1.png'} alt={'sample1'} style={{ width: '100%' }} />
          </Grid.Col>
        </Grid>
      </Container>
    </section>
  )
}

export default SectionTwo
