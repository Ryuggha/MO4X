using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Orbit : MonoBehaviour
{
    [SerializeField] public float radius;
    [SerializeField] public float rotationSpeed;
    private LineRenderer lineRenderer;
    

    private void Awake()
    {
        lineRenderer = GetComponent<LineRenderer>();
    }

    public void drawOrbit()
    {
        int numOfSegments = 255;

        Vector3[] points = new Vector3[numOfSegments];
        for (int i = 0; i < numOfSegments; i++)
        {
            float angle = ((float)i / (float)numOfSegments) * 360 * Mathf.Deg2Rad;
            float x = Mathf.Sin(angle) * radius;
            float z = Mathf.Cos(angle) * radius;
            points[i] = new Vector3(x, 0, z);
        }

        lineRenderer.positionCount = numOfSegments;
        lineRenderer.SetPositions(points);
    }

    // Update is called once per frame
    void Update()
    {
        transform.rotation = Quaternion.Euler(0, transform.rotation.eulerAngles.y + (rotationSpeed * Time.deltaTime), 0);
    }
}
