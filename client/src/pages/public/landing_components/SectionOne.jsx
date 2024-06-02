import { Carousel } from '@mantine/carousel'
import { Text, Container, useMantineTheme, Title, Center } from '@mantine/core'
// import '../Styles/SectionOne.scss'

const SectionOne = () => {
  const theme = useMantineTheme()

  const carouselContent = {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: theme.colors.brand[4],
    color:'white',
    borderRadius: 15,
    gap: 15,
  }

  return (
    <section id="section-one">
      <Container>
        <Text color="black" align="center" mb="15px">
          <Title order={1}>خدمات المنصة</Title>
        </Text>

        <Text color="black" align="center" mb="25px">
          هناك الكثير من الخدمات التي تقدمها المنصة أهمها:
        </Text>

        <Carousel
          withIndicators
          height={300}
          slideSize="33.333333%"
          slideGap="md"
          breakpoints={[
            { maxWidth: 'md', slideSize: '50%' },
            { maxWidth: 'sm', slideSize: '100%', slideGap: 15 },
          ]}
          loop
          align="center"
          pr="10px"
          pl="10px"
        >
          <Carousel.Slide>
            <div style={carouselContent}>
              <Title order={2}>1</Title>
              <Text>هيكلة العملية التعلمية منذ البداية الى النهاية.</Text>
            </div>
          </Carousel.Slide>
          <Carousel.Slide>
            <div style={carouselContent}>
              <Title order={2}>2</Title>
              <Text>نظام تعلم عن بعد متكامل، يجمع بين المعلم والطالب والمؤسسة التعليمية.</Text>
            </div>
          </Carousel.Slide>
          <Carousel.Slide>
            <div className='' style={carouselContent}>
              <Title order={2}>3</Title>
              <Center>نظام لإدارة درجات الطلاب وتخزينها بشكل آمن?</Center>
            </div>
          </Carousel.Slide>
          <Carousel.Slide>
            <div style={carouselContent}>
              <Title order={2}>4</Title>
              <Text>نظام مراسلة وتواصل متكامل...</Text>
            </div>
          </Carousel.Slide>
          <Carousel.Slide>
            <div style={carouselContent}>
              <Title order={2}>5</Title>
              <Text>نظام لادارة المستخدمين بكفائة ..</Text>
            </div>
          </Carousel.Slide>
          <Carousel.Slide>
            <div style={carouselContent}>
              <Title order={2}>6</Title>
              <Text>تحليلات ونتائج تسهل اتخاذ القرار!</Text>
            </div>
          </Carousel.Slide>
        </Carousel>
      </Container>
    </section>
  )
}

export default SectionOne
