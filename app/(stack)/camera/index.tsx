import { useContext, useEffect, useRef, useState } from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { CameraContext } from '@/context/Camera.context';
import { ThemeContext } from '@/context/Theme.context';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CameraScreen() {
  const { theme } = useContext( ThemeContext );
  const { cameraState, resetImage, saveImage } = useContext( CameraContext );
  const safeArea = useSafeAreaInsets();

  const [facing, setFacing] = useState<CameraType>('back');
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] =
    MediaLibrary.usePermissions();

  const [selectedImage, setSelectedImage] = useState<string>();

  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    requestCameraPermission();
    requestMediaPermission()
  }, [])
  

  if (!cameraPermission) {
    return <View />;
  }

  const onShutterButtonPress = async () => {
    if (!cameraRef.current) return;

    const picture = await cameraRef.current.takePictureAsync({
      quality: 0.7,
    });

    console.log(picture);

    if (!picture?.uri) return;

    setSelectedImage(picture.uri);

    // TODO: guardar imagen
  };

  const onReturnCancel = () => {
    resetImage();

    router.dismiss();
  };

  const onPictureAccepted = async () => {
    if (!selectedImage) return;

    await MediaLibrary.createAssetAsync(selectedImage);

    saveImage(selectedImage)

    router.dismiss();
  };

  const onRetakePhoto = () => {
    setSelectedImage(undefined);
  };

  const onPickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
      aspect: [4, 3],
      selectionLimit: 5,
    });

    if (result.canceled) return;

    result.assets.forEach((asset) => {
      saveImage(asset.uri)
    });

    router.dismiss();
  };

  function toggleCameraFacing() {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  }

  if (selectedImage) {
    return (
      <View style={{
        ...styles.container,
        marginBottom: safeArea.bottom,
      }}>
        <Image source={{ uri: selectedImage }} style={styles.camera} />

        <ConfirmImageButton onPress={onPictureAccepted} />

        <RetakeImageButton onPress={onRetakePhoto} />

        <ReturnCancelButton onPress={onReturnCancel} />
      </View>
    );
  }

  return (
    <View style={{
        ...styles.container,
        marginBottom: safeArea.bottom,
      }}>
      <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
        <ShutterButton onPress={onShutterButtonPress} />

        <FlipCameraButton onPress={toggleCameraFacing} />

        <GalleryButton onPress={onPickImages} />

        <ReturnCancelButton onPress={onReturnCancel} />
      </CameraView>
    </View>
  );
}

const ShutterButton = ({ onPress = () => {} }) => {
  const { theme } = useContext( ThemeContext );
  const dimensions = useWindowDimensions();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.shutterButton,
        {
          position: 'absolute',
          bottom: 30,
          left: dimensions.width / 2 - 32,
          borderColor: theme.colors.card,
        },
      ]}
    ></TouchableOpacity>
  );
};

const FlipCameraButton = ({ onPress = () => {} }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.flipCameraButton}>
      <Ionicons name="camera-reverse-outline" size={30} color="white" />
    </TouchableOpacity>
  );
};
const GalleryButton = ({ onPress = () => {} }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.galleryButton}>
      <Ionicons name="images-outline" size={30} color="white" />
    </TouchableOpacity>
  );
};

const ReturnCancelButton = ({ onPress = () => {} }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.returnCancelButton}>
      <Ionicons name="arrow-back-outline" size={30} color="white" />
    </TouchableOpacity>
  );
};

const ConfirmImageButton = ({ onPress = () => {} }) => {
  const dimensions = useWindowDimensions();
  const { theme } = useContext( ThemeContext );

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.shutterButton,
        {
          position: 'absolute',
          bottom: 30,
          left: dimensions.width / 2 - 32,
          borderColor: theme.colors.card,
        },
      ]}
    >
      <Ionicons name="checkmark-outline" size={30} color={theme.colors.primary} />
    </TouchableOpacity>
  );
};

const RetakeImageButton = ({ onPress = () => {} }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.flipCameraButton}>
      <Ionicons name="close-outline" size={30} color="white" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },

  shutterButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'white',
    // borderColor: 'red',
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },

  flipCameraButton: {
    width: 50,
    height: 50,
    borderRadius: 32,
    backgroundColor: '#17202A',
    position: 'absolute',
    bottom: 40,
    right: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },

  galleryButton: {
    width: 50,
    height: 50,
    borderRadius: 32,
    backgroundColor: '#17202A',
    position: 'absolute',
    bottom: 40,
    left: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },

  returnCancelButton: {
    width: 50,
    height: 50,
    borderRadius: 32,
    backgroundColor: '#17202A',
    position: 'absolute',
    top: 40,
    left: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
});