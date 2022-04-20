using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ConexionController : MonoBehaviour
{
    public static ConexionController instance;

    [SerializeField] private string conexionEndPoint = "http://127.0.0.1:13756";

    [SerializeField] private string userName;
    private string userId;

    private void Awake()
    {
        if (SceneController.instance != null)
        {
            Destroy(gameObject);
        }
        else
        {
            ConexionController.instance = this;
            DontDestroyOnLoad(this);
        }
    }

    public string getConexionEndPoint()
    {
        return conexionEndPoint;
    }

    public void setUserName(string userName)
    {
        this.userName = userName;
    }

    public void setUserId (string userId)
    {
        this.userId = userId;
    }
}
