import { StatusBar } from 'expo-status-bar';
import { ImageBackground,SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableHighlight, View } from 'react-native';
import { useState } from 'react';
import { Platform } from 'react-native';

const Form = (props) => {
  const [numSubjects, setNumSubjects] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [page,setPage] = useState(1);

  const handleSubjectChange = (index, field, value) => {
    const updatedSubjects = [...subjects];
    updatedSubjects[index][field] = value;
    setSubjects(updatedSubjects);
  };

  const renderSubjectInputs = () => {
    const inputs = [];
    for (let i = 0; i < numSubjects; i++) {
      if (!subjects[i]) {
        subjects[i] = { name: '',totalMarks:0, internalMarks: 0, externalMarks: 0, credits: 0 };
      }
      inputs.push(
        <View key={i}>
          <Text style={styles.form_text}>Subject {i + 1}</Text>
          <TextInput
            placeholder="Subject Name"
            style={styles.textInput}
            onChangeText={(text) => handleSubjectChange(i, 'name', text)}
          />
          <TextInput
            placeholder="Total Marks"
            keyboardType="numeric"
            style={styles.textInput}
            onChangeText={(text) => handleSubjectChange(i, 'totalMarks', parseFloat(text))}
          />
          <TextInput
            placeholder="Internal Marks"
            keyboardType="numeric"
            style={styles.textInput}
            onChangeText={(text) => handleSubjectChange(i, 'internalMarks', parseFloat(text))}
          />
          <TextInput
            placeholder="External Marks"
            keyboardType="numeric"
            style={styles.textInput}
            onChangeText={(text) => handleSubjectChange(i, 'externalMarks', parseFloat(text))}
          />
          <TextInput
            placeholder="Credits"
            keyboardType="numeric"
            style={styles.textInput}
            onChangeText={(text) => handleSubjectChange(i, 'credits', parseInt(text))}
          />
        </View>
      );
    }
    return inputs;
  };

  const renderResult = ()=> {
    let totalCredits = 0;
    let totalGradePoints = 0;

    subjects.forEach((subject) => {
      const { totalMarks, internalMarks, externalMarks, credits } = subject;
      const percentage = (((internalMarks/totalMarks)*100)+externalMarks)/2;
      const gradePoints = calculateGradePoints(percentage);
      totalGradePoints += gradePoints * credits;
      totalCredits += credits;
    });

    let gpa = totalGradePoints / totalCredits;
    gpa =  gpa.toFixed(2);
    let extras = {};
    if (gpa < 5){
      extras = {...extras,textShadowColor:'red'}
    }else if(gpa<7){
      extras = {...extras,textShadowColor:'blue'}
    }else{
      extras = {...extras,textShadowColor:'green'}
    }
    let res = '';
    if (isNaN(gpa)){
      res = 'Error: Missing Data\n        Try Again!';
    }else{
      res = 'Your GPA is '+gpa;
    }
    return <>
    <View>
      <Text style={{...styles.result,...extras}}>{res}</Text>
    </View>
    </>
  }

  const calculateGradePoints = (marks) => {
    if (marks>=95){
      return 10.0;
    }else if(marks >=85){
      return 9.0;
    }else if(marks>=75){
      return 8.0;
    }else if(marks>=65){
      return 7.0;
    }else if(marks>=55){
      return 6.0;
    }else if(marks>=45){
      return 5.0;
    }else if(marks>=40){
      return 4.0;
    }else{
      return 0.0;
    }
  };
  var topbar_text = {};
  if (Platform.OS === 'ios'){
    topbar_text = styles.topbar_text_ios;
  }else{
    topbar_text = styles.topbar_text_android;
  }
  return (
    <ScrollView>
      <View style={styles.topbar}>
        <Text style={topbar_text}>GPA Calculator</Text>
      </View>
      {page === 1 && <>
        <Text style={styles.form_text}>Enter Number of Subjects: </Text>
        <TextInput 
          style={styles.textInput}
          keyboardType = 'numeric'
          onChangeText = {(text)=> setNumSubjects(text)}
          value = {numSubjects}
        />
        <TouchableHighlight style={styles.button} onPress={()=>{
          if (numSubjects===''){
            console.warn('Invalid Data');
          }else{setPage(2);}
          }}>
          <Text style={{color:'white',fontSize:30}}>Next</Text>
        </TouchableHighlight>
        </>}
      {page === 2 && <>
        <TouchableHighlight style={styles.button} onPress={()=>{setPage(1);}}>
          <Text style={{color:'white',fontSize:30}}>Back</Text>
        </TouchableHighlight>
        {renderSubjectInputs()}
        <TouchableHighlight style={styles.button} onPress={()=>{
          if (subjects.every){setPage(3);}
          else{console.warn('Missing Data');}
          }}>
          <Text style={{color:'white',fontSize:30}}>Next</Text>
        </TouchableHighlight>
      </>}
      {page === 3 && <>
        {renderResult()}
        <TouchableHighlight style={{...styles.button,width:200}} onPress={()=>{setPage(2);}}>
          <Text style={{color:'white',fontSize:30}}>Re-Enter Details</Text>
        </TouchableHighlight>
        <TouchableHighlight style={styles.button} onPress={()=>{setPage(1);setNumSubjects('');setSubjects([]);}}>
          <Text style={{color:'white',fontSize:30}}>New</Text>
        </TouchableHighlight>
      </>}
    </ScrollView>
 );
}
export default function App() {
  return (<>
    <StatusBar style='dark-content'/>
    <SafeAreaView style={{flex:1,backgroundColor:'white'}}>
    <ImageBackground
      source={require('./assets/bgimg_sgpa.jpg')}
      style={styles.bg}>
      <Form/>
    </ImageBackground>
    </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  topbar:{
    flex:0.1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: '10%',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20
  },
  topbar_text_android:{
    color:'white',
    fontSize: 50,
    fontFamily: 'monospace',
    textShadowRadius:1,
    textShadowColor:'white',
    textShadowOffset:{width:2}
  },
  topbar_text_ios:{
    color:'white',
    fontSize: 50,
    fontFamily: 'American Typewriter',
    textShadowRadius:1,
    textShadowColor:'white',
    textShadowOffset:{width:2}
  },
  form_text:{
    padding: '5%',
    fontSize:30,
    fontWeight: 'bold'
  },
  textInput:{
    fontWeight: 'bold',
    fontSize: 30,
    height: 60,
    width: '95%',
    margin: 12,
    borderWidth: 2,
    padding: 12,
    color:'black',
    borderColor: 'black',
  },
  button:{
    backgroundColor:'black',
    height: 40,
    width: 100,
    alignSelf:'center',
    alignItems:'center',
    justifyContent:'center',
    borderRadius: 10,
    marginVertical: 10
  },
  result:{
    marginVertical:100,
    marginHorizontal: 20,
    fontSize: 50,
    color:'black',
    textShadowRadius:1,
    textShadowOffset:{width:1,height:1}
  },
  bg:{
    height:'100%',
    width:'100%',
  }
});
