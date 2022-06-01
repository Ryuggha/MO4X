using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class SystemGenerator : MonoBehaviour
{

    public void OnBackClick()
    {
        SceneController.instance.changeScene("StellarMap");
    }
}
